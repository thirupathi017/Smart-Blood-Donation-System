import React from 'react';
import { Bell, AlertCircle, Clock, CheckCircle, MessageCircle, X, CheckCheck } from 'lucide-react';
import useSocket from '../store/useSocket';

const DashboardNotifications = () => {
    const { notifications, removeNotification, markAllAsRead, setActiveChatUser } = useSocket();

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Bell size={18} className="text-primary-500" />
                    Recent Alerts
                    {notifications.length > 0 && (
                        <span className="text-[10px] font-bold bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full uppercase border border-primary-100">
                            {notifications.length}
                        </span>
                    )}
                </h3>

                {notifications.length > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-primary-600 bg-slate-100 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-primary-100"
                        title="Mark all as read"
                    >
                        <CheckCheck size={13} /> Mark all as read
                    </button>
                )}
            </div>

            <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">
                        <CheckCircle size={40} className="mx-auto mb-3 opacity-10" />
                        <p className="text-sm font-medium text-slate-500">No new notifications</p>
                        <p className="text-xs text-slate-400 mt-1">Everything looks good!</p>
                    </div>
                ) : (
                    notifications.map((n, i) => {
                        const isMessage = n.type === 'MESSAGE';
                        const isEmergency = n.type === 'EMERGENCY' || n.isEmergency;
                        const senderName = n.fromUserName || 'Blood Link';
                        const initials = senderName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

                        return (
                            <div key={i} className="p-4 hover:bg-slate-50 transition-colors relative group">
                                {/* Dismiss (X) button — manual only */}
                                <button
                                    onClick={() => removeNotification(i)}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all p-1 rounded-full hover:bg-red-50"
                                    title="Dismiss"
                                >
                                    <X size={14} />
                                </button>

                                <div className="flex gap-3 pr-6">
                                    {/* Avatar / Icon */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                        isEmergency
                                            ? 'bg-red-100 text-red-600'
                                            : isMessage
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {isEmergency ? <AlertCircle size={18} /> : initials}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-sm font-bold truncate ${isEmergency ? 'text-red-600' : 'text-slate-800'}`}>
                                                {isMessage ? senderName : (isEmergency ? '🚨 Emergency Alert' : 'Blood Link')}
                                            </p>
                                            <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                                                <Clock size={9} /> Just now
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                                            {n.message}
                                        </p>

                                        {/* Reply button — only for MESSAGE type, does NOT auto-dismiss notification */}
                                        {isMessage && (
                                            <button
                                                onClick={() => {
                                                    setActiveChatUser({ id: n.fromUserId, name: n.fromUserName });
                                                }}
                                                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm"
                                            >
                                                <MessageCircle size={11} /> Reply
                                            </button>
                                        )}

                                        {/* Emergency blood group tag */}
                                        {isEmergency && n.bloodGroup && (
                                            <span className="mt-2 inline-flex items-center text-[9px] font-bold text-red-500 border border-red-100 bg-red-50 px-2 py-0.5 rounded-full uppercase">
                                                {n.bloodGroup} • {n.city}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DashboardNotifications;
