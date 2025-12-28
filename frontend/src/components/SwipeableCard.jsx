import React, { useState, useRef, useEffect } from 'react';
import { Heart, X, Music, Disc, Activity, Info } from 'lucide-react';
import Card from './ui/Card';

const SwipeableCard = ({ user, score, breakdown, onSwipe, nextCard }) => {
    const [dragStart, setDragStart] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isAnimating, setIsAnimating] = useState(false);
    const cardRef = useRef(null);

    // Config
    const SWIPE_THRESHOLD = 120;

    const handleTouchStart = (e) => {
        if (isAnimating) return;
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchMove = (e) => {
        if (!dragStart || isAnimating) return;
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        const deltaX = currentX - dragStart.x;
        const deltaY = currentY - dragStart.y;

        setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleTouchEnd = () => {
        if (!dragStart || isAnimating) return;

        if (dragOffset.x > SWIPE_THRESHOLD) {
            handleSwipeValues('right');
        } else if (dragOffset.x < -SWIPE_THRESHOLD) {
            handleSwipeValues('left');
        } else {
            // Reset
            setDragOffset({ x: 0, y: 0 });
        }
        setDragStart(null);
    };

    const handleSwipeValues = (direction) => {
        setIsAnimating(true);
        // Animate off screen
        const endX = direction === 'right' ? 1000 : -1000;
        setDragOffset({ x: endX, y: 50 }); // Slight drop visually

        setTimeout(() => {
            onSwipe(direction);
            setDragOffset({ x: 0, y: 0 });
            setIsAnimating(false);
        }, 300); // Wait for transition
    };

    // Calculate rotation and opacity for stamps based on offset
    const rotate = (dragOffset.x / 20); // max rotation
    const likeOpacity = Math.min(Math.max(dragOffset.x / 100, 0), 1);
    const nopeOpacity = Math.min(Math.max(-dragOffset.x / 100, 0), 1);

    const getScoreColor = (s) => {
        if (s >= 80) return 'text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]';
        if (s >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="relative w-full max-w-sm h-[600px] flex items-center justify-center select-none touch-none">
            {/* Background Card (the 'next' one visually) */}
            {nextCard && (
                <div className="absolute w-full h-full transform scale-95 translate-y-4 opacity-70 z-0 pointer-events-none">
                    <Card variant="default" className="w-full h-full overflow-hidden border border-white/5 bg-bg-card">
                        <div className="h-2/3 bg-gray-800">
                            {nextCard.user.photos?.[0] && <img src={nextCard.user.photos[0]} alt="" className="w-full h-full object-cover opacity-50" />}
                        </div>
                    </Card>
                </div>
            )}

            {/* Foreground Card */}
            <div
                ref={cardRef}
                className="absolute inset-0 z-10 w-full h-full bg-bg-card rounded-3xl shadow-2xl overflow-hidden border border-white/10 cursor-grab active:cursor-grabbing"
                style={{
                    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotate}deg)`,
                    transition: isAnimating ? 'transform 0.3s ease-out' : 'none'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* LIKE/NOPE Stamps */}
                <div
                    className="absolute top-8 left-8 border-4 border-primary rounded-xl p-2 px-4 transform -rotate-12 pointer-events-none z-20 bg-black/40 backdrop-blur-sm"
                    style={{ opacity: likeOpacity }}
                >
                    <span className="text-4xl font-bold text-primary uppercase tracking-tighter">LIKE</span>
                </div>
                <div
                    className="absolute top-8 right-8 border-4 border-red-500 rounded-xl p-2 px-4 transform rotate-12 pointer-events-none z-20 bg-black/40 backdrop-blur-sm"
                    style={{ opacity: nopeOpacity }}
                >
                    <span className="text-4xl font-bold text-red-500 uppercase tracking-tighter">PASS</span>
                </div>

                {/* Main Content */}
                <div className="h-[65%] relative bg-bg-surface-light group pointer-events-none"> {/* content pointer-events-none to prevent interfering with swipe */}
                    {user.photos && user.photos[0] ? (
                        <img
                            src={user.photos[0]}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            draggable={false}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-bg-surface-light text-gray-600">
                            No Photo
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold font-display text-white tracking-tight leading-none drop-shadow-md">{user.name}, {user.age}</h2>
                                <p className="text-gray-300 text-sm mt-1 font-medium">{user.location?.type === 'Point' ? 'Nearby' : 'Unknown Location'}</p>
                            </div>
                            <div className="text-right bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10">
                                <span className={`text-2xl font-bold font-display block ${getScoreColor(score)}`}>{score}%</span>
                                <p className="text-[10px] text-primary uppercase tracking-widest font-bold">Match</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="h-[35%] bg-bg-card p-5 space-y-4 pointer-events-none">
                    {/* Breakdown Badges */}
                    <div className="flex flex-wrap gap-2">
                        {breakdown?.sharedArtists?.length > 0 && (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md border border-primary/20 flex items-center gap-1">
                                <Music size={10} /> {breakdown.sharedArtists.length} Shared Artists
                            </span>
                        )}
                        <span className="px-2 py-1 bg-white/5 text-gray-300 text-xs font-bold rounded-md border border-white/10 flex items-center gap-1">
                            <Activity size={10} /> {user.listeningStats?.energy > 0.6 ? 'High Energy' : 'Chill Vibes'}
                        </span>
                    </div>

                    {/* Bio Preview */}
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                        {user.bio || "Music lover looking for concert buddies."}
                    </p>

                    {/* Top Artists Preview */}
                    <div className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase">Top 3:</span>
                        {user.topArtists?.slice(0, 3).map(artist => (
                            <span key={artist.id} className="text-xs text-white bg-white/10 px-2 py-1 rounded truncate max-w-[80px]">{artist.name}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons Below (Actually outside the drag area usually, but passed in prompt as below card) */}
        </div>
    );
};

export default SwipeableCard;
