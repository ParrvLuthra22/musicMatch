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
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Add a Song</h3>
                <button onClick={onCancel} className="text-gray-400 hover:text-white">Cancel</button>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a song..."
                    className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    autoFocus
                />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader className="animate-spin text-purple-500" size={24} />
                    </div>
                ) : results.length > 0 ? (
                    results.map((track) => (
                        <button
                            key={track.spotifyTrackId}
                            onClick={() => onSelect(track)}
                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors text-left group"
                        >
                            <img
                                src={track.albumArt || 'https://via.placeholder.com/40'}
                                alt={track.name}
                                className="w-10 h-10 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate">{track.name}</p>
                                <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                            </div>
                            <div className="p-2 bg-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus size={16} className="text-white" />
                            </div>
                        </button>
                    ))
                ) : query && (
                    <p className="text-center text-gray-500 py-4">No results found</p>
                )}
            </div>
        </div>
    );
};

export default SongSearch;
