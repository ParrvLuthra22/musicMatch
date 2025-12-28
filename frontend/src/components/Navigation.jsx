import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, LogOut, User, Settings, MessageCircle, Home, Search, Heart } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navigation = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Don't show navigation on auth pages or landing page if not logged in
    const hideNavigationPaths = ['/login', '/register', '/landing', '/'];
    if (hideNavigationPaths.includes(location.pathname) && !user) {
        return null;
    }

    return (
        <nav className="hidden md:flex flex-col w-64 h-screen bg-bg-card border-r border-white/10 fixed left-0 top-0 p-6 z-50">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="p-2">
                    <Music className="text-primary glow-cyan-sm" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tighter">
                    Tune<span className="text-primary">Mate</span>
                </h1>
            </div>

            <div className="flex-1 space-y-2">
                <NavLink to="/dashboard" icon={<Home size={20} />} label="Home" active={location.pathname === '/dashboard'} />
                <NavLink to="/discover" icon={<Music size={20} />} label="Discover" active={location.pathname === '/discover'} />
                <NavLink to="/matches" icon={<Heart size={20} />} label="Matches" active={location.pathname === '/matches'} />
                <NavLink
                    to="/conversations"
                    icon={<MessageCircle size={20} />}
                    label="Messages"
                    active={location.pathname.startsWith('/conversations') || location.pathname.startsWith('/chat')}
                    badge={3} // Mock unread count
                />
                <NavLink to="/events" icon={<Search size={20} />} label="Events" active={location.pathname === '/events'} />
                <NavLink to="/profile" icon={<User size={20} />} label="Profile" active={location.pathname === '/profile'} />
                <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" active={location.pathname === '/settings'} />
            </div>

            {user && (
                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-bg-surface rounded-xl border border-white/5">
                        <img
                            src={user.photos?.[0] || 'https://via.placeholder.com/40'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">Premium</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

const NavLink = ({ to, icon, label, active, badge }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border relative ${active
            ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_15px_rgba(0,255,255,0.1)]'
            : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
            }`}
    >
        <span className={`${active ? 'text-primary' : 'text-gray-500 group-hover:text-white'}`}>
            {icon}
        </span>
        <span className="font-medium tracking-wide flex-1">{label}</span>
        {badge && (
            <span className="bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {badge}
            </span>
        )}
    </Link>
);

export default Navigation;
