import React from 'react';
import { Play, Pause, Music, BarChart2, Disc, Zap, Heart, Mic2 } from 'lucide-react';
import Card from '../ui/Card';

const MusicDNASection = ({ topArtists = [], topTracks = [], topGenres = [], listeningStats = {} }) => {
    // Helper for stats bars
    const StatBar = ({ label, value, icon: Icon, color }) => (
        <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Icon size={14} className={color} /> {label}
                </span>
                <span className="text-xs font-bold text-white">{(value * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
                    style={{ width: `${value * 100}%` }}
                />
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: Stats & Genres */}
            <div className="space-y-6">
                <Card variant="glass" className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BarChart2 size={100} />
                    </div>
                    <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
                        <Zap className="text-yellow-400" /> Vibe Check
                    </h3>

                    <div className="space-y-1">
                        <StatBar
                            label="Energy"
                            value={listeningStats.energy || 0.5}
                            icon={Zap}
                            color="text-yellow-400"
                        />
                        <StatBar
                            label="Danceability"
                            value={listeningStats.danceability || 0.5}
                            icon={Disc}
                            color="text-brand-cyan"
                        />
                        <StatBar
                            label="Valence (Mood)"
                            value={listeningStats.valence || 0.5}
                            icon={Heart}
                            color="text-pink-500"
                        />
                        <StatBar
                            label="Acousticness"
                            value={listeningStats.acousticness || 0.5}
                            icon={Mic2}
                            color="text-green-400"
                        />
                    </div>
                </Card>

                <Card variant="glass" className="p-6">
                    <h3 className="text-xl font-bold font-display mb-4">Top Genres</h3>
                    <div className="flex flex-wrap gap-2">
                        {topGenres.slice(0, 10).map((genre, i) => (
                            <span
                                key={genre}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border capitalize transition-all hover:scale-105 cursor-default ${i < 3
                                        ? 'bg-primary text-black border-primary'
                                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                                    }`}
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Right Col: Artists & Tracks */}
            <div className="space-y-6">
                {/* Top Artists Grid */}
                <div>
                    <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                        <Mic2 className="text-primary" /> Top Artists
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {topArtists.slice(0, 6).map((artist) => (
                            <div key={artist.id} className="relative aspect-square rounded-xl overflow-hidden group bg-bg-surface-light">
                                {artist.image ? (
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        <Music size={24} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex items-end">
                                    <span className="text-xs font-bold text-white truncate w-full">{artist.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Tracks List */}
                <Card variant="glass" className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5">
                        <h3 className="font-bold font-display flex items-center gap-2">
                            <Disc className="text-primary" /> Top Tracks
                        </h3>
                    </div>
                    <div>
                        {topTracks.slice(0, 5).map((track, i) => (
                            <div
                                key={track.id}
                                className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0"
                            >
                                <span className="text-gray-500 font-bold w-4 text-center">{i + 1}</span>
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-bg-surface relative">
                                    {track.image && <img src={track.image} alt={track.name} className="w-full h-full object-cover" />}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play size={16} className="text-white fill-current" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-white text-sm truncate">{track.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MusicDNASection;
