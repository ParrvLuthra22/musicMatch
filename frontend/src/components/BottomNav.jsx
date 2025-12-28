import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Music, Heart, Calendar, User, MessageCircle } from 'lucide-react';

const BottomNav = () => {
    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/discover', icon: Music, label: 'Discover' },
        { path: '/matches', icon: Heart, label: 'Matches' },
        { path: '/conversations', icon: MessageCircle, label: 'Messages', badge: 3 }, // Mock badge
        { path: '/profile', icon: User, label: 'Profile' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-bg-card/90 backdrop-blur-xl border-t border-white/10 px-6 py-2 md:hidden z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center h-16">
                {navItems.map(({ path, icon: Icon, label, badge }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `
                            flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 relative group
                            ${isActive ? 'text-primary transform -translate-y-1' : 'text-gray-500 hover:text-gray-300'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`relative p-1.5 rounded-full transition-all ${isActive ? 'bg-primary/20' : ''}`}>
                                    <Icon size={isActive ? 24 : 22} />
                                    {badge && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-black border border-bg-card">
                                            {badge}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-bold tracking-wide transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
