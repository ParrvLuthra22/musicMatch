import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Music, Disc, Activity } from 'lucide-react';

const MatchCard = ({ user, score, breakdown, onSwipe }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Color for match score
    const getScoreColor = (s) => {
        if (s >= 80) return 'text-green-400';
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
            className="absolute w-full max-w-sm h-[600px] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 cursor-grab active:cursor-grabbing"
        >
            {/* Image Section */}
            <div className="h-1/2 relative bg-gray-800">
                {user.photos && user.photos[0] ? (
                    <img
                        src={user.photos[0]}
                        alt={user.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                        No Photo
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.name}, {user.age}</h2>
                            <p className="text-gray-300 text-sm">{user.location?.type === 'Point' ? 'Nearby' : 'Unknown Location'}</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Match</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="p-4 space-y-4 h-1/2 overflow-y-auto">
                {/* Breakdown Badges */}
                <div className="flex flex-wrap gap-2">
                    {breakdown.sharedArtists.length > 0 && (
                        <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full border border-purple-700 flex items-center gap-1">
                            <Music size={12} /> {breakdown.sharedArtists.length} Shared Artists
                        </span>
                    )}
                    {breakdown.genreCompatibility > 50 && (
                        <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full border border-blue-700 flex items-center gap-1">
                            <Disc size={12} /> High Genre Overlap
                        </span>
                    )}
                    {breakdown.audioFeaturesSimilarity > 70 && (
                        <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-full border border-green-700 flex items-center gap-1">
                            <Activity size={12} /> Similar Vibe
                        </span>
                    )}
                </div>

                {/* Top Artists */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase">Top Artists</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.topArtists.slice(0, 5).map(artist => (
                            <span key={artist.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-200">
                                {artist.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Top Genres */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase">Top Genres</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.topGenres.slice(0, 5).map(genre => (
                            <span key={genre} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-200">
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Overlay Hints */}
            <motion.div
                style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
                className="absolute top-10 left-10 border-4 border-green-500 rounded-lg p-2 transform -rotate-12 pointer-events-none"
            >
                <span className="text-4xl font-bold text-green-500 uppercase">Like</span>
            </motion.div>
            <motion.div
                style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
                className="absolute top-10 right-10 border-4 border-red-500 rounded-lg p-2 transform rotate-12 pointer-events-none"
            >
                <span className="text-4xl font-bold text-red-500 uppercase">Nope</span>
            </motion.div>
        </motion.div>
    );
};

export default MatchCard;
