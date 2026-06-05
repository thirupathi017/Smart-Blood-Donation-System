import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User, ShieldCheck, Trash2 } from 'lucide-react';
import axios from 'axios';
import useSocket from '../store/useSocket';
import useAuthStore from '../store/authStore';

const ChatWindow = ({ targetUser, onClose }) => {
    const { messages, sendMessage, loadChatHistory } = useSocket();
    const { user: currentUser } = useAuthStore();
    const [inputText, setInputText] = useState('');
    const [localMessages, setLocalMessages] = useState([]);
    const scrollRef = useRef();

    // Fetch previous chat history when the chat window opens
    useEffect(() => {
        if (targetUser && targetUser.id) {
            loadChatHistory(targetUser.id);
        }
    }, [targetUser]);

    // Filter messages for this specific conversation and remove any duplicates
    const chatMessages = messages.filter(m =>
        (String(m.fromUserId) === String(currentUser.id) && String(m.toUserId) === String(targetUser.id)) ||
        (String(m.fromUserId) === String(targetUser.id) && String(m.toUserId) === String(currentUser.id))
    ).filter((message, index, self) =>
        index === self.findIndex((t) => (
            t.text === message.text &&
            t.timestamp === message.timestamp &&
            t.fromUserId === message.fromUserId
        ))
    );

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            sendMessage(targetUser.id, inputText, currentUser);
            setInputText('');
        }
    };

    const handleClearChat = async () => {
        if (!window.confirm('Are you sure you want to clear this entire conversation? This cannot be undone.')) return;
        try {
            await axios.delete(`/api/chat/clear/${targetUser.id}`, {
                params: { userId: currentUser.id }
            });
            // Remove all messages for this conversation from the store by reloading (empty now)
            await loadChatHistory(targetUser.id);
        } catch (err) {
            console.error('Failed to clear chat:', err);
            alert('Failed to clear chat. Please try again.');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-10" style={{ height: '520px' }}>
            {/* Header — pinned at top */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                        <User size={20} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="font-bold text-sm flex items-center gap-1">
                            {targetUser.name} {targetUser.verified && <ShieldCheck size={14} className="text-primary-400" />}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Now</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {/* Clear Chat button */}
                    {chatMessages.length > 0 && (
                        <button
                            onClick={handleClearChat}
                            className="p-2 hover:bg-red-600 rounded-full transition-colors group"
                            title="Clear Chat"
                        >
                            <Trash2 size={16} className="text-slate-400 group-hover:text-white" />
                        </button>
                    )}
                    {/* Close button */}
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Messages — scrollable, fills remaining space */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto overflow-x-hidden bg-slate-50/50 space-y-4 min-h-0">
                {chatMessages.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Secure Connection Established</p>
                        <p className="text-sm text-slate-500 italic">"Always verify identities before sharing personal medical info."</p>
                    </div>
                )}
                {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${String(m.fromUserId) === String(currentUser.id) ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            String(m.fromUserId) === String(currentUser.id)
                            ? 'bg-red-600 text-white rounded-tr-none shadow-md shadow-red-100'
                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                        }`}>
                            {m.text}
                            <p className={`text-[10px] mt-1 opacity-60 ${String(m.fromUserId) === String(currentUser.id) ? 'text-right' : 'text-left'}`}>
                                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input — pinned at bottom */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2 flex-shrink-0">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-100 outline-none"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
