import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import MatchPlaylistCard from '../components/MatchPlaylistCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import Input from '../components/ui/Input';

const ConversationsPage = () => {
    const [matches, setMatches] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');

                // Fetch Matches
                const matchesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/matches`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Fetch Conversations
                const conversationsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setMatches(matchesRes.data);
                setConversations(conversationsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to find conversation for a match
    const getConversationForMatch = (matchUserId) => {
        return conversations.find(c =>
            c.participants.some(p => (p._id || p) === matchUserId)
        );
    };

    // Filter matches
    const filteredMatches = matches.filter(match =>
        match.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-bg-dark text-white p-6 pb-24 md:pl-[17rem] font-body selection:bg-primary selection:text-black">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-display tracking-tight text-white mb-1">Your Matches</h1>
                        <p className="text-gray-400">People who vibe on your frequency.</p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search matches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 bg-bg-card border border-white/5 rounded-xl pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                    {/* Use a stylized filter button */}
                    <button className="h-12 w-12 flex items-center justify-center bg-bg-card border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMatches.map(match => (
                            <MatchPlaylistCard
                                key={match._id}
                                match={match}
                                conversation={getConversationForMatch(match.user._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-white/5 rounded-3xl bg-bg-card/30">
                        {searchQuery ? (
                            <p className="text-gray-500">No matches found for "{searchQuery}"</p>
                        ) : (
                            <>
                                <p className="text-xl font-bold text-gray-300 mb-2">No matches yet</p>
                                <p className="text-gray-500 mb-6">Start swiping to build your playlist of people!</p>
                                <a href="/discover" className="bg-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors">
                                    Go to Discover
                                </a>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationsPage;
