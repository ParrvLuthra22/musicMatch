import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Music, Disc, Activity } from 'lucide-react';

const MatchCard = ({ user, score, breakdown, onSwipe }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Color for match score - keeping functional colors but brighter
    const getScoreColor = (s) => {
        if (s >= 80) return 'text-brand-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]';
        if (s >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const handleDragEnd = (event, info) => {
        if (info.offset.x > 100) {
            onSwipe('right');
        } else if (info.offset.x < -100) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute w-full max-w-sm h-[600px] bg-brand-surface rounded-3xl shadow-2xl overflow-hidden border border-white/10 cursor-grab active:cursor-grabbing"
        >
            {/* Image Section */}
            <div className="h-1/2 relative bg-brand-surface-light">
                {user.photos && user.photos[0] ? (
                    <img
                        src={user.photos[0]}
                        alt={user.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-surface-light text-gray-600">
                        No Photo
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-black/90 to-transparent p-6 pt-12">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}, {user.age}</h2>
                            <p className="text-gray-300 text-sm">{user.location?.type === 'Point' ? 'Nearby' : 'Unknown Location'}</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                            <p className="text-xs text-brand-cyan uppercase tracking-widest font-bold">Match</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-5 h-1/2 overflow-y-auto bg-brand-surface">
                {/* Breakdown Badges */}
                <div className="flex flex-wrap gap-2">
                    {breakdown.sharedArtists.length > 0 && (
                        <span className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-xs font-medium rounded-full border border-brand-cyan/20 flex items-center gap-1.5">
                            <Music size={12} /> {breakdown.sharedArtists.length} Shared Artists
                        </span>
                    )}
                    {breakdown.genreCompatibility > 50 && (
                        <span className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-xs font-medium rounded-full border border-brand-cyan/20 flex items-center gap-1.5">
                            <Disc size={12} /> High Genre Overlap
                        </span>
                    )}
                    {breakdown.audioFeaturesSimilarity > 70 && (
                        <span className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-xs font-medium rounded-full border border-brand-cyan/20 flex items-center gap-1.5">
                            <Activity size={12} /> Similar Vibe
                        </span>
                    )}
                </div>

                {/* Top Artists */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Top Artists</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.topArtists.slice(0, 5).map(artist => (
                            <span key={artist.id} className="px-3 py-1.5 bg-brand-surface-light border border-white/5 rounded-lg text-sm text-gray-200">
                                {artist.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Top Genres */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Top Genres</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.topGenres.slice(0, 5).map(genre => (
                            <span key={genre} className="px-3 py-1.5 bg-brand-surface-light border border-white/5 rounded-lg text-sm text-gray-200">
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Overlay Hints */}
            <motion.div
                style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
                className="absolute top-8 left-8 border-4 border-brand-cyan rounded-xl p-2 px-4 transform -rotate-12 pointer-events-none bg-brand-black/50 backdrop-blur-md"
            >
                <span className="text-4xl font-bold text-brand-cyan uppercase tracking-tighter shadow-black drop-shadow-lg">LIKE</span>
            </motion.div>
            <motion.div
                style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
                className="absolute top-8 right-8 border-4 border-red-500 rounded-xl p-2 px-4 transform rotate-12 pointer-events-none bg-brand-black/50 backdrop-blur-md"
            >
                <span className="text-4xl font-bold text-red-500 uppercase tracking-tighter shadow-black drop-shadow-lg">NOPE</span>
            </motion.div>
        </motion.div>
    );
};

export default MatchCard;
