import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Loader } from 'lucide-react';

const SongSearch = ({ onSelect, onCancel }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchSongs = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/spotify/search?query=${query}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(data);
            } catch (error) {
                console.error('Error searching songs:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(searchSongs, 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="p-6 pb-2 border-b border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white font-display">Add a Song</h3>
                        <p className="text-sm text-gray-400">Find the perfect track for your mix</p>
                    </div>
                    {/* Close button handled by parent overlay usually, but keeping cancel here just in case */}
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Spotify..."
                        className="w-full bg-bg-dark border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-600"
                        autoFocus
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-primary">
                        <Loader className="animate-spin mb-2" size={24} />
                        <span className="text-xs font-bold tracking-widest uppercase opacity-70">Searching</span>
                    </div>
                ) : results.length > 0 ? (
                    results.map((track) => (
                        <button
                            key={track.spotifyTrackId}
                            onClick={() => onSelect(track)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-left group border border-transparent hover:border-white/5"
                        >
                            <div className="relative w-12 h-12 shrink-0">
                                <img
                                    src={track.albumArt || 'https://via.placeholder.com/40'}
                                    alt={track.name}
                                    className="w-full h-full rounded-md object-cover shadow-sm"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md transition-opacity">
                                    <Plus size={20} className="text-white" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate group-hover:text-primary transition-colors">{track.name}</p>
                                <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                            </div>
                        </button>
                    ))
                ) : query ? (
                    <div className="flex flex-col items-center justify-center py-12 opacity-50">
                        <p className="text-sm text-gray-400">No results found for "{query}"</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 pb-20">
                        <Search size={48} className="mb-4" />
                        <p className="text-sm font-bold">Search for your favorite tracks</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SongSearch;
