import React, { useState } from 'react';
import { ExternalLink, Plus, Music, Play, User as UserIcon, ListMusic } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const PlaylistView = ({ playlist, onAddTrack, currentUser }) => {
    // If playlist is null, return early (or show creating state)
    if (!playlist) return null;

    // Helper to get initials or avatar
    const getAddedBy = (addedByUser) => {
        if (!addedByUser) return null;
        const isMe = currentUser && (addedByUser._id === currentUser._id || addedByUser === currentUser._id);
        return {
            name: isMe ? 'You' : addedByUser.name,
            isMe
        };
    };

    return (
        <div className="w-full h-[80vh] bg-bg-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col relative">
            {/* Background Mood Blur */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="p-6 relative z-10 flex flex-col items-center border-b border-white/5 bg-bg-card/50 backdrop-blur-sm">
                <div className="w-32 h-32 mb-4 relative shadow-lg group">
                    {/* Dynamic Album Cover (Collage could come later, for now placeholder or first album art) */}
                    <div className="w-full h-full rounded-lg overflow-hidden bg-bg-dark border border-white/10 flex items-center justify-center">
                        {playlist.songs.length > 0 ? (
                            <img src={playlist.songs[0].albumArt} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <ListMusic size={40} className="text-gray-600" />
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white font-display text-center leading-tight mb-1">
                    {playlist.name}
                </h2>

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        {playlist.songs.length} Tracks
                    </span>
                </div>

                <a
                    href={`https://open.spotify.com/playlist/${playlist.spotifyPlaylistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-full font-bold text-sm transition-all shadow-lg hover:scale-105"
                >
                    <ExternalLink size={16} />
                    Open in Spotify
                </a>
            </div>

            {/* Song List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {playlist.songs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                        <div className="p-4 bg-white/5 rounded-full mb-4">
                            <Music size={32} className="text-primary" />
                        </div>
                        <p className="text-lg font-bold text-white mb-1">It's quiet here...</p>
                        <p className="text-sm text-gray-400">Add songs to start your shared mixtape!</p>
                    </div>
                ) : (
                    playlist.songs.map((song, index) => {
                        const addedBy = getAddedBy(song.addedBy);
                        return (
                            <div
                                key={index}
                                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default"
                            >
                                {/* Song Number / Play Icon */}
                                <div className="w-8 flex justify-center text-gray-500 font-mono text-xs">
                                    <span className="group-hover:hidden">{index + 1}</span>
                                    <Play size={12} className="hidden group-hover:block text-primary" />
                                </div>

                                {/* Art */}
                                <img
                                    src={song.albumArt || 'https://via.placeholder.com/40'}
                                    alt={song.name}
                                    className="w-10 h-10 rounded shadow-sm object-cover"
                                />

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate leading-snug group-hover:text-primary transition-colors">
                                        {song.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {song.artist}
                                    </p>
                                </div>

                                {/* Added By Badge */}
                                {addedBy && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 border border-white/5" title={`Added by ${addedBy.name}`}>
                                        <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                                            {addedBy.name[0]}
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${addedBy.isMe ? 'text-primary' : 'text-gray-400'}`}>
                                            {addedBy.isMe ? 'You' : addedBy.name.split(' ')[0]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-white/10 bg-bg-card relative z-10">
                <button
                    onClick={onAddTrack}
                    className="w-full py-3 bg-primary text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                >
                    <Plus size={20} />
                    Add a Song
                </button>
            </div>
        </div>
    );
};

export default PlaylistView;
