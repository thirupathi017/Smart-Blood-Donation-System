import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useSocketStore = create((set, get) => ({
    notifications: [],
    messages: [],
    connected: false,
    client: null,

    connect: (user) => {
        if (!user || get().client) return;

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
                        set(state => ({ notifications: [notification, ...state.notifications] }));
                    }
                });
                
                stompClient.subscribe(`/user/queue/messages`, (msg) => {
                    if (msg.body) {
                        const message = JSON.parse(msg.body);
                        set(state => ({ 
                            messages: [...state.messages, message],
                            notifications: [{
                                title: `Message from ${message.fromUserName}`,
                                message: message.text,
                                type: 'MESSAGE',
                                fromUserId: message.fromUserId,
                                fromUserName: message.fromUserName,
                                timestamp: message.timestamp
                            }, ...state.notifications]
                        }));
                    }
                });

                stompClient.subscribe('/topic/emergency', (msg) => {
                    if (msg.body) {
                        const alert = JSON.parse(msg.body);
                        if (alert.senderId !== user.id) {
                            set(state => ({ 
                                notifications: [{ ...alert, isEmergency: true }, ...state.notifications] 
                            }));
                        }
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
        if (client && client.connected) {
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
        }
    }
}));

export default useSocketStore;
