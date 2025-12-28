import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Play, MessageCircle, Music, User, Heart, Activity, Search, Calendar, ChevronRight } from 'lucide-react';
import MatchGridCard from '../components/MatchGridCard';
import { useToast } from '../context/ToastContext';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ matchesToday: 0, totalMatches: 0, unreadMessages: 0, topGenre: '-' });
    const [recentMatches, setRecentMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Random music quote
    const quotes = [
        "\"Music is the strongest form of magic.\"",
        "\"One good thing about music, when it hits you, you feel no pain.\"",
        "\"Where words fail, music speaks.\"",
        "\"Without music, life would be a mistake.\""
    ];
    const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // Ideally we have a dashboard endpoint, but we can aggregate efficiently
                // For MVP, we'll fetch matches and derive stats
                const matchesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/matches`, { headers });

                const matches = matchesRes.data || [];
                const totalMatches = matches.length;

                // Mock "Today" count (random for demo or real if timestamps available)
                // Assuming match object has createdAt, but falling back to 0 if not
                const matchesToday = matches.filter(m => {
                    if (!m.createdAt) return false;
                    const matchDate = new Date(m.createdAt);
                    const today = new Date();
                    return matchDate.getDate() === today.getDate() &&
                        matchDate.getMonth() === today.getMonth() &&
                        matchDate.getFullYear() === today.getFullYear();
                }).length;

                // Mock Unread with random for excitement or 0
                const unreadMessages = Math.floor(Math.random() * 3);

                // Top Genre from user
                const topGenre = user?.topArtists?.[0]?.genres?.[0] || 'Pop';

                setStats({
                    matchesToday,
                    totalMatches,
                    unreadMessages,
                    topGenre: topGenre.charAt(0).toUpperCase() + topGenre.slice(1)
                });

                setRecentMatches(matches.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const StatCard = ({ icon: Icon, label, value, subLabel }) => (
        <div className="bg-bg-card p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-32 hover:border-primary/50 transition-colors group">
            <div className="flex justify-between items-start">
                <div className="p-2 rounded-xl bg-bg-surface text-primary group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                </div>
                <span className="text-3xl font-bold text-white font-display group-hover:text-primary transition-colors">{value}</span>
            </div>
            <div>
                <p className="font-bold text-gray-200 text-sm">{label}</p>
                {subLabel && <p className="text-xs text-gray-500">{subLabel}</p>}
            </div>
        </div>
    );

    const ActionCard = ({ title, desc, icon: Icon, onClick, image }) => (
        <button
            onClick={onClick}
            className="relative w-full overflow-hidden bg-bg-card rounded-3xl border border-white/10 p-6 text-left group hover:scale-[1.02] transition-all h-full"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={120} />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="p-3 bg-white/5 w-fit rounded-xl text-primary mb-4 border border-white/5">
                        <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display mb-1">{title}</h3>
                    <p className="text-sm text-gray-400 max-w-[80%]">{desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
                    Open <ChevronRight size={16} />
                </div>
            </div>
        </button>
    );

    return (
        <div className="min-h-screen bg-bg-dark text-white pb-24 md:pl-[17rem] font-body selection:bg-primary selection:text-black">

            {/* Header */}
            <div className="p-8 pb-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-2">
                            {getTimeGreeting()}, <span className="text-primary">{user?.name}</span>
                        </h1>
                        <p className="text-gray-400 italic text-sm">{quote}</p>
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <img src={user?.photos?.[0]} alt="Profile" className="w-6 h-6 rounded-full" />
                        <span className="text-sm font-bold">My Profile</span>
                    </button>
                </div>
            </div>

            <div className="p-8 pt-2">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={Heart} label="New Matches" value={stats.matchesToday} subLabel="Today" />
                        <StatCard icon={MessageCircle} label="Unread" value={stats.unreadMessages} subLabel="Messages" />
                        <StatCard icon={Activity} label="Compatibility" value={stats.totalMatches > 0 ? "84%" : "-"} subLabel="Average Score" />
                        <StatCard icon={Music} label="Top Vibe" value={stats.topGenre} subLabel="This Week" />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Quick Actions (Left 2 cols) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center px-1">
                                <h2 className="text-xl font-bold font-display">Jump Back In</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
                                <ActionCard
                                    title="Discover"
                                    desc="Find your next music match today."
                                    icon={Search}
                                    onClick={() => navigate('/discover')}
                                />
                                <ActionCard
                                    title="Concerts"
                                    desc="See who's playing near you."
                                    icon={Calendar}
                                    onClick={() => navigate('/events')}
                                />
                            </div>
                        </div>

                        {/* Recent Matches (Right 1 col) */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h2 className="text-xl font-bold font-display">Recent Matches</h2>
                                <button onClick={() => navigate('/matches')} className="text-xs font-bold text-primary hover:text-white uppercase tracking-wider">View All</button>
                            </div>

                            <div className="bg-bg-card border border-white/10 rounded-3xl p-4 min-h-[16rem] flex flex-col gap-3">
                                {loading ? (
                                    <div className="flex-1 flex justify-center items-center">
                                        <div className="animate-spin text-primary">
                                            <Activity />
                                        </div>
                                    </div>
                                ) : recentMatches.length > 0 ? (
                                    recentMatches.map(match => (
                                        <button
                                            key={match._id}
                                            onClick={() => navigate(`/matches`)} // Go to matches for now, simpler
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                                        >
                                            <img
                                                src={match.photos?.[0] || 'https://via.placeholder.com/40'}
                                                alt={match.name}
                                                className="w-10 h-10 rounded-full border border-white/10 object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white truncate">{match.name}</p>
                                                <p className="text-xs text-gray-400">Matched {new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col justify-center items-center text-center opacity-50 p-4">
                                        <Heart size={32} className="mb-2" />
                                        <p className="text-sm font-bold">No matches yet</p>
                                        <p className="text-xs">Start swiping to find people!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Weekly Music Wrap (Widget) */}
                    <div className="bg-gradient-to-r from-bg-card to-bg-card/50 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Music size={200} />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold font-display mb-4">Your Music VS The World</h2>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                        <span className="text-2xl font-bold text-primary">#{Math.floor(Math.random() * 5) + 1}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Top Listener</p>
                                        <p className="text-lg font-bold text-white">The Weeknd</p>
                                    </div>
                                </div>
                                <div className="h-px md:h-auto md:w-px bg-white/10" />
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                        <Activity size={24} className="text-pink-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Listening Vibe</p>
                                        <p className="text-lg font-bold text-white">High Energy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
