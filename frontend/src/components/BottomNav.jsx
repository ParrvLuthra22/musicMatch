import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Music, Heart, Calendar, User } from 'lucide-react';

const BottomNav = () => {
    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/discover', icon: Music, label: 'Discover' },
        { path: '/matches', icon: Heart, label: 'Matches' },
        { path: '/events', icon: Calendar, label: 'Events' },
        { path: '/profile', icon: User, label: 'Profile' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-6 py-3 md:hidden z-40 pb-safe">
            <div className="flex justify-between items-center">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `
                            flex flex-col items-center gap-1 transition-colors
                            ${isActive ? 'text-purple-500' : 'text-gray-500 hover:text-gray-300'}
                        `}
                    >
                        <Icon size={24} />
                        <span className="text-[10px] font-medium">{label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
