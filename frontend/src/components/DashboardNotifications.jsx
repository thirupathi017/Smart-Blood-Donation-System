import React, { useState } from 'react';
import { Bell, AlertCircle, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import useSocket from '../store/useSocket';
import ChatWindow from './ChatWindow';

const DashboardNotifications = () => {
    const { notifications } = useSocket();
    const [activeChatUser, setActiveChatUser] = useState(null);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Bell size={20} className="text-primary-600" /> Recent Alerts
                </h3>
                {notifications.length > 0 && (
                    <span className="text-[10px] font-bold bg-primary-100 text-primary-600 px-2 py-1 rounded-full uppercase">
                        {notifications.length} New
                    </span>
                )}
            </div>
            
            <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <CheckCircle size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm">No new notifications. Everything looks good!</p>
                    </div>
                ) : (
                    notifications.map((n, i) => (
                        <div key={i} className={`p-6 hover:bg-slate-50 transition-colors ${n.isEmergency ? 'bg-red-50/20' : ''}`}>
                            <div className="flex gap-4">
                                {n.isEmergency ? (
                                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                                        <AlertCircle size={20} />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <Bell size={20} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold truncate ${n.isEmergency ? 'text-red-600' : 'text-slate-900'}`}>
                                        {n.title || (n.isEmergency ? 'Emergency Alert' : 'System Notification')}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                        {n.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                        {n.isEmergency && (
                                            <span className="text-[9px] font-bold text-red-400 border border-red-100 px-1.5 py-0.5 rounded uppercase">
                                                {n.bloodGroup} • {n.city}
                                            </span>
                                        )}
                                        {n.type === 'MESSAGE' && (
                                            <button 
                                                onClick={() => setActiveChatUser({ id: n.fromUserId, name: n.fromUserName })}
                                                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                                <MessageCircle size={10} /> Reply
                                            </button>
                                        )}
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto">
                                            <Clock size={10} /> Just now
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {notifications.length > 0 && (
                <button className="w-full p-4 text-xs font-bold text-slate-400 hover:text-primary-600 hover:bg-slate-50 transition-all border-t border-slate-50 uppercase tracking-widest">
                    View All Notifications
                </button>
            )}

            {activeChatUser && (
                <ChatWindow 
                    targetUser={activeChatUser} 
                    onClose={() => setActiveChatUser(null)} 
                />
            )}
        </div>
    );
};

export default DashboardNotifications;
