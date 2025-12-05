import React from 'react';
import { ExternalLink, Plus, Music } from 'lucide-react';

const PlaylistView = ({ playlist, onAddTrack }) => {
    if (!playlist) return null;

    return (
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl border border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">{playlist.name}</h2>
                    <p className="text-sm text-gray-400">{playlist.songs.length} songs</p>
                </div>
                <a
                    href={`https://open.spotify.com/playlist/${playlist.spotifyPlaylistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-500 rounded-full text-black hover:bg-green-400 transition-colors"
                    title="Open in Spotify"
                >
                    <ExternalLink size={20} />
                </a>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 custom-scrollbar">
                {playlist.songs.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <Music size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No songs yet. Add some!</p>
                    </div>
                ) : (
                    playlist.songs.map((song, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl hover:bg-gray-800 transition-colors">
                            <img
                                src={song.albumArt || 'https://via.placeholder.com/40'}
                                alt={song.name}
                                className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate">{song.name}</p>
                                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                            </div>
                            {song.addedBy && (
                                <div className="text-xs text-gray-500 flex flex-col items-end min-w-[60px]">
                                    <span>Added by</span>
                                    <span className="text-purple-400 truncate max-w-[80px]">{song.addedBy.name}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={onAddTrack}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
                <Plus size={20} />
                Add Song
            </button>
        </div>
    );
};

export default PlaylistView;
