import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Play, MessageCircle, Music, User, Heart, Activity } from 'lucide-react';
import MatchGridCard from '../components/MatchGridCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ matchesToday: 0, totalMatches: 0, unreadMessages: 0, topGenre: '-' });
    const [recentMatches, setRecentMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes, matchesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/matches`, { headers })
                ]);

                setStats(statsRes.data);
                setRecentMatches(matchesRes.data.slice(0, 5)); // Top 5 recent
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <LoadingState />;

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
            <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </div>
    );

    const QuickLink = ({ icon: Icon, label, desc, onClick, color }) => (
        <button
            onClick={onClick}
            className="w-full bg-gray-900 hover:bg-gray-800 p-4 rounded-2xl border border-gray-800 flex items-center gap-4 transition-all group text-left"
        >
            <div className={`p-3 rounded-xl ${color} text-white group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-white">{label}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
            </div>
            <Play size={20} className="text-gray-600 group-hover:text-white transition-colors" />
        </button>
    );

    return (
        <div className="min-h-screen bg-black text-white pb-24 px-4 pt-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Good evening, {user?.name}</h1>
                <p className="text-gray-400">Here's what's happening with your music life.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Heart} label="Matches Today" value={stats.matchesToday} color="bg-pink-500" />
                <StatCard icon={User} label="Total Matches" value={stats.totalMatches} color="bg-purple-500" />
                <StatCard icon={MessageCircle} label="Unread Msgs" value={stats.unreadMessages} color="bg-green-500" />
                <StatCard icon={Activity} label="Top Vibe" value={stats.topGenre} color="bg-blue-500" />
            </div>

            {/* Recent Matches */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-bold">Recent Matches</h2>
                    <button onClick={() => navigate('/matches')} className="text-sm text-purple-400 hover:text-purple-300">See all</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                    {recentMatches.length > 0 ? (
                        recentMatches.map(match => (
                            <div key={match._id} className="min-w-[160px] w-[160px] snap-start animate-scale-in">
                                <MatchGridCard match={match} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full">
                            <EmptyState
                                title="No matches yet"
                                description="Start swiping to find your rhythm!"
                                actionLabel="Go to Discover"
                                onAction={() => navigate('/discover')}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Links */}
            <h2 className="text-xl font-bold mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickLink
                    icon={Music}
                    label="Discover"
                    desc="Find new matches based on music taste"
                    onClick={() => navigate('/discover')}
                    color="bg-gradient-to-br from-purple-600 to-blue-600"
                />
                <QuickLink
                    icon={MessageCircle}
                    label="Messages"
                    desc="Chat with your matches"
                    onClick={() => navigate('/conversations')}
                    color="bg-gradient-to-br from-green-500 to-emerald-600"
                />
                <QuickLink
                    icon={User}
                    label="Profile"
                    desc="Update your photos and anthem"
                    onClick={() => navigate('/profile')}
                    color="bg-gradient-to-br from-pink-500 to-rose-600"
                />
            </div>
        </div>
    );
};

export default DashboardPage;
