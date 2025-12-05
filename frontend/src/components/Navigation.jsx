import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, LogOut, User, Settings, MessageCircle, Home, Search } from 'lucide-react';
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
        <nav className="hidden md:flex flex-col w-64 h-screen bg-gray-900 border-r border-gray-800 fixed left-0 top-0 p-6 z-50">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                    <Music className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    TuneMate
                </h1>
            </div>

            <div className="flex-1 space-y-2">
                <NavLink to="/discover" icon={<Home size={20} />} label="Discover" active={location.pathname === '/discover'} />
                <NavLink to="/events" icon={<Search size={20} />} label="Events" active={location.pathname === '/events'} />
                <NavLink to="/conversations" icon={<MessageCircle size={20} />} label="Messages" active={location.pathname.startsWith('/conversations') || location.pathname.startsWith('/chat')} />
                <NavLink to="/profile" icon={<User size={20} />} label="Profile" active={location.pathname === '/profile'} />
                <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" active={location.pathname === '/settings'} />
            </div>

            {user && (
                <div className="pt-6 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-gray-800/50 rounded-xl">
                        <img
                            src={user.photos?.[0] || 'https://via.placeholder.com/40'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">Premium Member</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
    >
        <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
            {icon}
        </span>
        <span className="font-medium">{label}</span>
    </Link>
);

export default Navigation;
