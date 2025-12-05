import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import MatchGridCard from '../components/MatchGridCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

const MatchesPage = () => {
    const [matches, setMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, high_compatibility, new
    const [sort, setSort] = useState('date'); // date, score
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/matches`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMatches(data);
                setFilteredMatches(data);
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    useEffect(() => {
        let result = [...matches];

        // Search
        if (search) {
            result = result.filter(m => m.user.name.toLowerCase().includes(search.toLowerCase()));
        }

        // Filter
        if (filter === 'high_compatibility') {
            result = result.filter(m => m.score >= 80);
        } else if (filter === 'new') {
            // Matches from last 24h
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            result = result.filter(m => new Date(m.createdAt) > yesterday);
        }

        // Sort
        if (sort === 'date') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sort === 'score') {
            result.sort((a, b) => b.score - a.score);
        }

        setFilteredMatches(result);
    }, [matches, filter, sort, search]);

    return (
        <div className="min-h-screen bg-black text-white pb-20 pt-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Your Matches</h1>
                        <p className="text-gray-400">{matches.length} vibes found</p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search matches..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-purple-500 w-full sm:w-64"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('high_compatibility')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'high_compatibility' ? 'bg-gray-800 text-purple-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                Top Picks
                            </button>
                            <button
                                onClick={() => setFilter('new')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'new' ? 'bg-gray-800 text-green-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                New
                            </button>
                        </div>

                        {/* Sort */}
                        <button
                            onClick={() => setSort(prev => prev === 'date' ? 'score' : 'date')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            <ArrowUpDown size={18} />
                            <span className="text-sm font-medium">
                                {sort === 'date' ? 'Recent' : 'Compatibility'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <LoadingState />
                ) : filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredMatches.map(match => (
                            <div key={match._id} className="animate-fade-in">
                                <MatchGridCard match={match} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No matches found"
                        description="Try adjusting your filters or search query."
                    />
                )}
            </div>
        </div>
    );
};

export default MatchesPage;
