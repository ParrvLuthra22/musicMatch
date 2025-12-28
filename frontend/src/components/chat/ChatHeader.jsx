import React from 'react';
import { ArrowLeft, MoreVertical, Shield, Loader, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ otherUser, matchScore }) => {
    const navigate = useNavigate();

    return (
        <div className="h-16 px-4 bg-bg-dark/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/conversations')}
                    className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                {otherUser ? (
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate(`/profile/${otherUser._id}`)}
                    >
                        <div className="relative">
                            <img
                                src={otherUser.photos?.[0]}
                                alt={otherUser.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-primary/50 transition-colors"
                            />
                            {/* Online indicator could go here */}
                        </div>
                        <div>
                            <h2 className="font-bold text-white leading-tight flex items-center gap-2">
                                {otherUser.name}
                                {matchScore && (
                                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-display rounded-sm">
                                        {matchScore}%
                                    </span>
                                )}
                            </h2>
                            <p className="text-xs text-gray-500 group-hover:text-primary transition-colors">
                                View Profile
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                        <div className="space-y-1">
                            <div className="w-20 h-4 bg-white/5 rounded animate-pulse" />
                            <div className="w-12 h-3 bg-white/5 rounded animate-pulse" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
