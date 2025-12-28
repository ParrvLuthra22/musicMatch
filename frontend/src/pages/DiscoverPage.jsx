import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import MatchCard from '../components/MatchCard';
import { Heart, X, RefreshCw } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const DiscoverPage = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useContext(AuthContext);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/matches/discover`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMatches(data);
        } catch (error) {
            console.error('Error fetching matches:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleSwipe = async (direction, match) => {
        // Optimistically remove card
        setMatches(prev => prev.filter(m => m.user._id !== match.user._id));

        try {
            const token = localStorage.getItem('token');
            const action = direction === 'right' ? 'like' : 'pass';

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/matches/action`, {
                targetUserId: match.user._id,
                action
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.status === 'matched') {
                alert(`It's a Match! You matched with ${match.user.name}!`);
            }
        } catch (error) {
            console.error('Error processing swipe:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-black text-white flex flex-col items-center overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="w-full p-4 flex justify-between items-center z-10 bg-brand-black/50 backdrop-blur-sm border-b border-white/5 md:hidden">
                <h1 className="text-2xl font-bold tracking-tighter">
                    Tune<span className="text-brand-cyan text-glow">Mate</span>
                </h1>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">Logout</button>
            </div>

            {/* Card Deck */}
            <div className="flex-1 w-full flex items-center justify-center relative max-w-sm mt-4 md:mt-0 z-10">
                <AnimatePresence>
                    {matches.length > 0 ? (
                        matches.map((match, index) => (
                            index === 0 && (
                                <MatchCard
                                    key={match.user._id}
                                    user={match.user}
                                    score={match.score}
                                    breakdown={match.breakdown}
                                    onSwipe={(dir) => handleSwipe(dir, match)}
                                />
                            )
                        ))
                    ) : (
                        <div className="text-center p-8 bg-brand-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl mx-4">
                            <div className="mb-6 text-gray-500">
                                <RefreshCw size={48} className="mx-auto mb-4 text-brand-cyan/50" />
                                <p className="text-lg font-medium text-gray-300">No more profiles nearby.</p>
                                <p className="text-sm mt-2">Check back later for more music matches.</p>
                            </div>
                            <button
                                onClick={fetchMatches}
                                className="px-8 py-3 bg-brand-cyan hover:bg-brand-cyan-hover text-brand-black rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                            >
                                Refresh
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls (Visual only, since swipe is main interaction) */}
            <div className="h-24 w-full flex items-center justify-center gap-8 pb-8 z-10 md:hidden">
                <button
                    onClick={() => matches.length > 0 && handleSwipe('left', matches[0])}
                    className="p-4 bg-brand-surface/80 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500/10 hover:scale-110 transition-all border border-white/10 shadow-lg"
                >
                    <X size={32} />
                </button>
                <button
                    onClick={() => matches.length > 0 && handleSwipe('right', matches[0])}
                    className="p-4 bg-brand-surface/80 backdrop-blur-md rounded-full text-brand-cyan hover:bg-brand-cyan/10 hover:scale-110 transition-all border border-brand-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                    <Heart size={32} fill="currentColor" />
                </button>
            </div>
        </div>
    );
};

export default DiscoverPage;
