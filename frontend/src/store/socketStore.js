import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

const useSocketStore = create((set, get) => ({
    notifications: [],
    messages: [],
    connected: false,
    client: null,
    connecting: false,

    connect: (user) => {
        if (!user || get().client || get().connecting) return;
        set({ connecting: true });

        // Load persisted notifications from the server on connect
        axios.get(`/api/notifications/${user.id}`).then(res => {
            const serverNotifs = res.data.map(n => ({
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type,
                fromUserId: n.fromUserId,
                fromUserName: n.fromUserName,
                timestamp: n.timestamp
            }));
            set(state => {
                // Prevent duplicates if loaded multiple times (e.g. React StrictMode)
                const existingIds = new Set(state.notifications.filter(n => n.id != null).map(n => n.id));
                const newNotifs = serverNotifs.filter(n => !existingIds.has(n.id));
                return {
                    notifications: [...newNotifs, ...state.notifications]
                };
            });
        }).catch(err => console.warn('Failed to load notifications:', err));

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            onConnect: () => {
                set({ connected: true });

                stompClient.subscribe(`/user/queue/notifications`, (msg) => {
                    if (msg.body) {
                        const notification = JSON.parse(msg.body);
                        
                        if (notification.type === 'MESSAGE') {
                            const currentActiveChat = get().activeChatUser;
                            if (currentActiveChat && String(currentActiveChat.id) === String(notification.fromUserId)) {
                                // Automatically dismiss notification if chat is active
                                return;
                            }
                        }
                        
                        set(state => {
                            // Prevent duplicates based on ID if they happen to come through twice
                            if (notification.id && state.notifications.some(n => n.id === notification.id)) {
                                return state;
                            }
                            return { notifications: [notification, ...state.notifications] };
                        });
                    }
                });
                
                stompClient.subscribe(`/user/queue/messages`, (msg) => {
                    if (msg.body) {
                        const message = JSON.parse(msg.body);
                        
                        // Ignore if we sent this message (already added optimistically)
                        if (String(message.fromUserId) === String(user.id)) return;
                        
                        // Only accept messages addressed to the current user
                        if (message.toUserId && String(message.toUserId) !== String(user.id)) return;

                        set(state => ({ messages: [...state.messages, message] }));
                    }
                });

            },
            onDisconnect: () => set({ connected: false }),
            onStompError: (frame) => console.warn('STOMP error:', frame),
            reconnectDelay: 5000,
        });

        stompClient.activate();
        set({ client: stompClient });
    },

    disconnect: () => {
        const { client } = get();
        if (client) {
            client.deactivate();
            set({ client: null, connected: false });
        }
    },

    sendMessage: (toUserId, text, user) => {
        const { client } = get();
        if (client && client.active) {
            const msgObj = {
                fromUserId: user.id,
                fromUserName: user.name,
                toUserId,
                text,
                timestamp: new Date().toISOString()
            };
            client.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(msgObj)
            });
            set(state => ({ messages: [...state.messages, msgObj] }));
        } else {
            console.error("Cannot send message: STOMP client is not active");
            alert("Connection lost. Please refresh the page to reconnect to chat.");
        }
    },

    // Load chat history from the server for a specific conversation
    loadChatHistory: async (otherUserId, userId) => {
        try {
            const res = await axios.get(`/api/chat/history/${otherUserId}`, {
                params: { userId }
            });
            set(state => {
                // Remove all existing messages for this conversation to prevent duplication
                // with optimistic/websocket messages that have different timestamp formats
                const otherMessages = state.messages.filter(m => 
                    !(String(m.fromUserId) === String(userId) && String(m.toUserId) === String(otherUserId)) &&
                    !(String(m.fromUserId) === String(otherUserId) && String(m.toUserId) === String(userId))
                );
                
                return { messages: [...otherMessages, ...res.data] };
            });
        } catch (err) {
            console.warn('Failed to load chat history:', err);
        }
    },

    removeNotification: (index) => {
        set(state => ({
            notifications: state.notifications.filter((_, i) => i !== index)
        }));
    },

    markAllAsRead: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            axios.put(`/api/notifications/${user.id}/read-all`).catch(() => {});
        }
        set({ notifications: [] });
    },

    setActiveChatUser: (targetUser) => {
        set(state => {
            if (targetUser) {
                // Only mark as read on server — do NOT remove from UI
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    axios.put(`/api/chat/read/${targetUser.id}`, null, {
                        params: { userId: user.id }
                    }).catch(() => {});
                }
            }
            return { activeChatUser: targetUser };
        });
    }
}));

export default useSocketStore;
