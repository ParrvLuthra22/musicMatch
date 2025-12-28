import React from 'react';
import { Play, Check, ExternalLink } from 'lucide-react';

const MessageBubble = ({ message, isOwn }) => {
    // Determine type: 'text' or 'song'
    const isSong = message.type === 'song' || !!message.spotifyTrack;

    // Formatting timestamp
    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex w-full mb-4 ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            {/* Avatar for valid non-own messages could be added here if layout shifts */}

            <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>

                {/* Bubble Content */}
                <div
                    className={`
                        relative px-4 py-3 rounded-2xl shadow-sm
                        ${isOwn
                            ? 'bg-primary text-black rounded-tr-none'
                            : 'bg-bg-card border border-white/10 text-white rounded-tl-none'
                        }
                        ${isSong ? 'p-0 overflow-hidden w-64' : ''}
                    `}
                >
                    {isSong ? (
                        // Song Card Layout
                        <div className="w-full">
                            <div className="relative aspect-square w-full bg-black group cursor-pointer">
                                <img
                                    src={message.spotifyTrack?.image || message.spotifyTrack?.albumArt} // varied naming in backend vs frontend
                                    alt="Album Art"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                        <Play size={20} fill="black" className="ml-1 text-black" />
                                    </div>
                                </div>
                            </div>
                            <div className={`p-3 ${isOwn ? 'bg-primary-dark/10' : 'bg-white/5'}`}>
                                <h4 className={`font-bold text-sm truncate ${isOwn ? 'text-black' : 'text-white'}`}>
                                    {message.spotifyTrack?.name || "Unknown Track"}
                                </h4>
                                <p className={`text-xs truncate ${isOwn ? 'text-black/70' : 'text-gray-400'}`}>
                                    {message.spotifyTrack?.artist || "Unknown Artist"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Text Layout
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                            {message.content}
                        </p>
                    )}
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-gray-500 font-bold tracking-wide">{time}</span>
                    {isOwn && (
                        <span className="text-primary">
                            {/* Read receipt logic would go here. For now static check. */}
                            <Check size={12} strokeWidth={3} />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
