import { useEffect } from 'react';
import useAuthStore from './authStore';
import useSocketStore from './socketStore';

const useSocket = () => {
    const { user } = useAuthStore();
    const { notifications, messages, connected, connect, disconnect, sendMessage } = useSocketStore();

    useEffect(() => {
        if (user) {
            connect(user);
        } else {
            disconnect();
        }
    }, [user, connect, disconnect]);

    return { 
        notifications, 
        messages, 
        connected,
        sendMessage: (toUserId, text) => sendMessage(toUserId, text, user)
    };
};

export default useSocket;
