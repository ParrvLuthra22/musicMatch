import React from 'react';
import { Calendar, MapPin, Share2 } from 'lucide-react';

const EventCard = ({ event, onClick, onShare }) => {
    // Prefer 3:4 or 4:3 images if available, else first one
    const image = event.images?.find(img => img.ratio === '3_4') || event.images?.[0];

    // Formatting
    const dateObj = new Date(event.dates.start.dateTime);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
    const venueCity = event.venues?.[0]?.city?.name || event.venues?.[0]?.city; // API structure varies

    return (
        <div
            className="group relative bg-bg-card rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] aspect-[3/4]"
            onClick={() => onClick && onClick(event)}
        >
            {/* Background Image */}
            <img
                src={image?.url || 'https://via.placeholder.com/400x600'}
                alt={event.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

            {/* Date Badge (Top Right) */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex flex-col items-center min-w-[60px]">
                <span className="text-xs font-bold text-primary tracking-wider">{month}</span>
                <span className="text-2xl font-bold text-white font-display">{day}</span>
            </div>

            {/* Content (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold text-black bg-primary rounded uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    Concert
                </span>

                <h3 className="text-2xl font-bold text-white font-display leading-tight mb-2 line-clamp-2 uppercase">
                    {event.name}
                </h3>

                <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                    <MapPin size={14} className="text-primary" />
                    <span className="truncate max-w-[200px]">{event.venues?.[0]?.name}, {venueCity}</span>
                </div>

                {/* Hidden Actions (Reveal on Hover) */}
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-4 border-t border-white/10">
                    <button className="flex-1 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
                        View Details
                    </button>
                    {onShare && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onShare(event); }}
                            className="p-2 bg-white/10 text-white rounded-lg hover:bg-primary hover:text-black transition-colors"
                            title="Share with Match"
                        >
                            <Share2 size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
