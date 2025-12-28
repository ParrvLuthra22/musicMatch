import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import SwipeableCard from '../components/SwipeableCard';
import MatchModal from '../components/MatchModal';
import { Heart, X, RefreshCw, Info, Sliders, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { MatchCardSkeleton } from '../components/Skeletons';

const DiscoverPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [matchedUser, setMatchedUser] = useState(null); // If set, shows MatchModal
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/match/discover`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCandidates(data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            // Artificial delay to show skeleton
            setTimeout(() => setLoading(false), 800);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleSwipe = async (direction, match) => {
        // Optimistically remove card
        const currentMatch = match || candidates[0];
        if (!currentMatch) return;

        setCandidates(prev => prev.slice(1)); // Remove top card

        try {
            const token = localStorage.getItem('token');
            const action = direction === 'right' ? 'like' : 'pass';

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/matches/action`, {
                targetUserId: currentMatch.user._id,
                action
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.status === 'matched') {
                setMatchedUser(currentMatch.user);
            }
        } catch (error) {
            console.error('Error processing swipe:', error);
            // Revert state if error? For now, we assume optimism is fine.
        }
    };

    // Use buttons to trigger swipe programmatically (simulating drag for the logic)
    const handleButtonSwipe = (direction) => {
        if (candidates.length === 0) return;
        handleSwipe(direction, candidates[0]);
    };

    if (loading || !candidates) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">
                <MatchCardSkeleton />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-dark text-white flex flex-col overflow-hidden relative font-body selection:bg-primary selection:text-black md:ml-64">
            {/* Note: Added md:ml-64 to account for fixed sidebar */}
            {matchedUser && <MatchModal matchedUser={matchedUser} onClose={() => setMatchedUser(null)} />}

            {/* Top Bar - Mobile Only mainly, or global controls */}
            <div className="md:hidden w-full h-16 px-6 flex justify-between items-center z-20 border-b border-white/5 bg-bg-dark/80 backdrop-blur-md fixed top-0">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-display tracking-tighter">Tune<span className="text-primary text-glow">Mate</span></span>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full pt-16 pb-20 md:pb-0 px-4">
                {/* Card Stack */}
                <div className="w-full max-w-sm h-[600px] relative z-10">
                    {candidates.length > 0 ? (
                        <SwipeableCard
                            key={candidates[0].user._id}
                            user={candidates[0].user}
                            score={candidates[0].score}
                            breakdown={candidates[0].breakdown}
                            onSwipe={(dir) => handleSwipe(dir, candidates[0])}
                            nextCard={candidates[1]}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-3xl bg-bg-card">
                            <RefreshCw size={48} className="text-primary/50 mb-4 animate-spin-slow" />
                            <h2 className="text-2xl font-bold font-display mb-2">You've seen everyone!</h2>
                            <p className="text-gray-400 mb-6">Expand your distance or age settings to find more music lovers.</p>
                            <button
                                onClick={fetchCandidates}
                                className="px-8 py-3 bg-primary text-bg-dark font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-105 transition-all"
                            >
                                Refresh Radar
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Action Bar */}
                {candidates.length > 0 && (
                    <div className="mt-8 flex items-center justify-center gap-6 z-20">
                        {/* PASS Button */}
                        <button
                            onClick={() => handleButtonSwipe('left')}
                            className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:border-red-500 hover:scale-110 transition-all bg-bg-dark"
                        >
                            <X size={32} />
                        </button>

                        {/* INFO Button */}
                        <button
                            onClick={() => navigate(`/profile/${candidates[0].user._id}`)}
                            className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all bg-bg-card"
                        >
                            <Info size={20} />
                        </button>

                        {/* LIKE Button */}
                        <button
                            onClick={() => handleButtonSwipe('right')}
                            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-bg-dark hover:scale-110 hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                        >
                            <Heart size={32} fill="currentColor" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoverPage;
