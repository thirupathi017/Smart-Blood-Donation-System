import { useEffect } from 'react';
import useAuthStore from './authStore';
import useSocketStore from './socketStore';

const useSocket = () => {
    const { user } = useAuthStore();
    const { notifications, messages, connected, connect, disconnect, sendMessage, removeNotification, markAllAsRead, activeChatUser, setActiveChatUser, loadChatHistory } = useSocketStore();

    useEffect(() => {
        if (user) {
            connect(user);
        } else {
            disconnect();
        }
        
        // Cleanup function is empty because we don't want to disconnect when individual components unmount.
        // Disconnection happens when `user` becomes null (handled in the if/else above).
        return () => {};
    }, [user, connect, disconnect]);

    return { 
        notifications, 
        messages, 
        connected,
        sendMessage: (toUserId, text) => sendMessage(toUserId, text, user),
        removeNotification,
        markAllAsRead,
        activeChatUser,
        setActiveChatUser,
        loadChatHistory: (otherUserId) => user ? loadChatHistory(otherUserId, user.id) : null
    };
};

export default useSocket;
