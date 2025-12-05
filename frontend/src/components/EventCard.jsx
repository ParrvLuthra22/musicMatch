import React from 'react';
import { Calendar, MapPin, ExternalLink, Share2 } from 'lucide-react';

const EventCard = ({ event, onShare }) => {
    const image = event.images?.find(img => img.ratio === '16_9' && img.width > 600) || event.images?.[0];
    const date = new Date(event.dates.start.dateTime).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
    const venue = event.venues?.[0];

    return (
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-purple-500/50 transition-all group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image?.url || 'https://via.placeholder.com/400x200'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white leading-tight mb-1">{event.name}</h3>
                    <p className="text-purple-400 font-medium text-sm">{event.attractions?.[0]?.name}</p>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Calendar size={16} className="text-purple-500" />
                    <span>{date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <MapPin size={16} className="text-purple-500" />
                    <span className="truncate">{venue?.name}, {venue?.city}</span>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                    <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 bg-white text-black rounded-xl font-bold text-center text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        Tickets <ExternalLink size={14} />
                    </a>
                    {onShare && (
                        <button
                            onClick={() => onShare(event)}
                            className="p-2 bg-gray-800 text-purple-500 rounded-xl hover:bg-gray-700 transition-colors"
                            title="Share with Match"
                        >
                            <Share2 size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
