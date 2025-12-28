import React from 'react';
import { Calendar, MapPin, ExternalLink, Share2, X, Music } from 'lucide-react';

const EventDetailsModal = ({ event, onClose, onShare }) => {
    if (!event) return null;

    const largeImage = event.images?.find(img => img.width > 1000) || event.images?.[0]; // Get biggest image
    const date = new Date(event.dates.start.dateTime).toLocaleDateString(undefined, {
        weekday: 'long', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric'
    });
    const venue = event.venues?.[0];
    const priceRange = event.priceRanges
        ? `${event.priceRanges[0].min.toFixed(0)} - ${event.priceRanges[0].max.toFixed(0)} ${event.priceRanges[0].currency}`
        : 'See details';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-bg-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-fade-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all"
                >
                    <X size={20} />
                </button>

                {/* Hero Image */}
                <div className="relative h-64 md:h-80 w-full">
                    <img
                        src={largeImage?.url}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 w-full">
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-black bg-primary rounded-full uppercase tracking-wider">
                            Concert
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-display leading-tight drop-shadow-lg">
                            {event.name}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 pt-4 space-y-8">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl">
                                    <Calendar className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Date & Time</h4>
                                    <p className="text-gray-400">{date}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl">
                                    <MapPin className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Venue</h4>
                                    <p className="text-gray-400">{venue?.name}</p>
                                    <p className="text-sm text-gray-500">{venue?.city}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl">
                                    <Music className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Lineup</h4>
                                    <p className="text-gray-400">
                                        {event.attractions?.map(a => a.name).join(', ') || event.name}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-sm text-gray-400 mb-1">Tickets starting at</p>
                                <p className="text-2xl font-bold text-white font-display">{priceRange}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/10">
                        <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-4 bg-primary text-black rounded-xl font-bold text-center hover:bg-primary-hover transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                        >
                            Get Tickets <ExternalLink size={18} />
                        </a>

                        <button
                            onClick={() => onShare(event)}
                            className="flex-1 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Share2 size={18} />
                            Suggest to Match
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
