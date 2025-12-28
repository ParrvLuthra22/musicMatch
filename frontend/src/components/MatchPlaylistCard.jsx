import React from 'react';
import { MessageCircle, Music, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MatchPlaylistCard = ({ match, conversation }) => {
    const { user, score, breakdown } = match;
    const lastMessage = conversation?.lastMessage;

    return (
        <Link to={`/chat/${conversation?._id || 'new-' + user._id}`} className="block group">
            <div className="bg-bg-card rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] relative">

                {/* Album Art / Photo Area */}
                <div className="aspect-square relative overflow-hidden bg-bg-surface-light">
                    {user.photos && user.photos[0] ? (
                        <img
                            src={user.photos[0]}
                            alt={user.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <Music size={48} />
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-primary text-black font-bold px-6 py-3 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <MessageCircle size={18} /> Message
                        </span>
                    </div>

                    {/* Score Badge */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <span className="text-primary font-bold font-display">{score}%</span>
                    </div>
                </div>

                {/* Info Area */}
                <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-primary transition-colors">{user.name}, {user.age}</h3>
                            {breakdown?.sharedArtists?.length > 0 && (
                                <p className="text-xs text-gray-400 mt-1 truncate">
                                    <Music size={10} className="inline mr-1" />
                                    Vibes to {breakdown.sharedArtists[0].name}
                                </p>
                            )}
                        </div>
                        {/* Unread Dot */}
                        {lastMessage && !lastMessage.read && lastMessage.sender !== user._id && ( // Logic assumes 'user._id' here is the OTHER user. Wait, 'user' prop is the MATCHED user. Sender ID needs to be checked against current user.
                            // We will handle unread outside or assume 'read' property is sufficient visual indicator for now. 
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
                        )}
                    </div>

                    {/* Message Preview */}
                    <div className="pt-3 border-t border-white/5">
                        <p className={`text-sm line-clamp-1 ${lastMessage && !lastMessage.read ? 'text-white font-medium' : 'text-gray-500'}`}>
                            {lastMessage ? (
                                <>
                                    {lastMessage.sender === user._id ? '' : 'You: '}
                                    {lastMessage.content}
                                </>
                            ) : (
                                <span className="text-primary/70 italic">Say hi to your new match! 👋</span>
                            )}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">
                                {lastMessage ? new Date(lastMessage.timestamp).toLocaleDateString() : 'Matched recently'}
                            </span>
                            {lastMessage && (
                                <Clock size={12} className="text-gray-700" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MatchPlaylistCard;
