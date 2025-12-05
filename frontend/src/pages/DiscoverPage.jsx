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
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center overflow-hidden relative">
            {/* Header */}
            <div className="w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black to-transparent">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    TuneMate
                </h1>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-white">Logout</button>
            </div>

            {/* Card Deck */}
            <div className="flex-1 w-full flex items-center justify-center relative max-w-sm">
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
                        <div className="text-center p-8">
                            <div className="mb-4 text-gray-500">
                                <RefreshCw size={48} className="mx-auto mb-2" />
                                <p>No more profiles nearby.</p>
                            </div>
                            <button
                                onClick={fetchMatches}
                                className="px-6 py-2 bg-purple-600 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls (Visual only, since swipe is main interaction) */}
            <div className="h-24 w-full flex items-center justify-center gap-8 pb-8 z-10">
                <button
                    onClick={() => matches.length > 0 && handleSwipe('left', matches[0])}
                    className="p-4 bg-gray-900 rounded-full text-red-500 hover:bg-gray-800 hover:scale-110 transition-all border border-gray-800 shadow-lg"
                >
                    <X size={32} />
                </button>
                <button
                    onClick={() => matches.length > 0 && handleSwipe('right', matches[0])}
                    className="p-4 bg-gray-900 rounded-full text-green-500 hover:bg-gray-800 hover:scale-110 transition-all border border-gray-800 shadow-lg"
                >
                    <Heart size={32} fill="currentColor" />
                </button>
            </div>
        </div>
    );
};

export default DiscoverPage;
