import React, { useState } from 'react';
import { Bell, X, AlertCircle } from 'lucide-react';
import useSocket from '../store/useSocket';

const NotificationBell = () => {
    const { notifications } = useSocket();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-500 hover:text-red-600 transition-colors relative"
            >
                <Bell size={20} />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        <button onClick={() => setIsOpen(false)}><X size={16} className="text-slate-400" /></button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center text-slate-400 text-sm">
                                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                                <p>All caught up!</p>
                            </div>
                        ) : (
                            notifications.map((n, i) => (
                                <div key={i} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${n.isEmergency ? 'bg-red-50/30' : ''}`}>
                                    <div className="flex gap-3">
                                        {n.isEmergency ? (
                                            <AlertCircle className="text-red-600 shrink-0" size={18} />
                                        ) : (
                                            <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                                        )}
                                        <div>
                                            <p className={`text-sm font-bold ${n.isEmergency ? 'text-red-600' : 'text-slate-800'}`}>
                                                {n.title || (n.isEmergency ? 'EMERGENCY ALERT' : 'Notification')}
                                            </p>
                                            <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                                            {n.isEmergency && (
                                                <p className="text-[10px] font-bold text-red-400 mt-1 uppercase">
                                                    Required: {n.bloodGroup} in {n.city}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
