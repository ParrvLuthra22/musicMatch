import React from 'react';
import { Bell, Heart, MessageCircle, Music, Calendar, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ isOpen, onClose, notifications = [], onMarkAllRead }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'match': return <Heart size={16} className="text-pink-500" />;
            case 'message': return <MessageCircle size={16} className="text-primary" />;
            case 'playlist': return <Music size={16} className="text-purple-500" />;
            case 'event': return <Calendar size={16} className="text-orange-500" />;
            default: return <Bell size={16} className="text-gray-400" />;
        }
    };

    const handleClick = (notification) => {
        // Logic to navigate based on type
        if (notification.link) navigate(notification.link);
        onClose();
    };

    return (
        <>
            {/* Backdrop for mobile closing */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            <div className="absolute right-0 top-16 w-80 md:w-96 bg-bg-card border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-white/10 bg-bg-surface/50 backdrop-blur-sm">
                    <h3 className="font-bold text-white font-display">Notifications</h3>
                    <button
                        onClick={onMarkAllRead}
                        className="text-xs text-primary hover:text-white transition-colors font-medium flex items-center gap-1"
                    >
                        Mark all read <Check size={12} />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                        notifications.map((note) => (
                            <button
                                key={note.id}
                                onClick={() => handleClick(note)}
                                className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-4 ${!note.read ? 'bg-primary/5' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center border border-white/10">
                                        {getIcon(note.type)}
                                    </div>
                                    {!note.read && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-bg-card" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white mb-1">{note.title}</p>
                                    <p className="text-xs text-gray-400 line-clamp-2">{note.message}</p>
                                    <p className="text-[10px] text-gray-500 mt-2">{note.time}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                            <Bell size={32} className="mb-3 opacity-50" />
                            <p className="text-sm">No new notifications</p>
                            <p className="text-xs mt-1 opacity-70">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationDropdown;
