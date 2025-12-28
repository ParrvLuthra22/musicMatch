import React from 'react';
import { Music, Bell, Menu } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const MobileTopHeader = ({ onMenuClick }) => {
    const { addToast } = useToast();

    return (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-bg-card/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-40">
            {/* Menu Button (Left) */}
            <button
                onClick={onMenuClick}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Menu"
            >
                <Menu size={24} />
            </button>

            {/* Logo (Center) */}
            <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                <Music className="text-primary glow-cyan-sm" size={24} />
                <h1 className="text-xl font-bold text-white tracking-tighter">
                    Tune<span className="text-primary">Mate</span>
                </h1>
            </div>

            {/* Notifications (Right) */}
            <button
                onClick={() => addToast('No new notifications', 'info')}
                className="p-2 text-gray-400 hover:text-white transition-colors relative"
            >
                <Bell size={24} />
                {/* Mock notification dot */}
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </button>
        </div>
    );
};

export default MobileTopHeader;
