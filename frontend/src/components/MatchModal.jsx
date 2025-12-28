import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { Music } from 'lucide-react';

const MatchModal = ({ matchedUser, onClose }) => {
    if (!matchedUser) return null;

    // Confetti CSS
    const confettiColors = ['#00FFFF', '#FF00FF', '#FFFFFF'];
    const particles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3
    }));

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl overflow-hidden">
                {/* Confetti Background */}
                <div className="absolute inset-0 pointer-events-none">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ y: -20, opacity: 1 }}
                            animate={{ y: window.innerHeight, opacity: 0, rotate: 360 }}
                            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
                            style={{
                                position: 'absolute',
                                left: `${p.x}%`,
                                width: '8px',
                                height: '8px',
                                backgroundColor: p.color,
                                borderRadius: '50%'
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: [0, -2, 2, 0] }}
                    className="relative z-10 max-w-md w-full text-center bg-bg-card/50 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md"
                >
                    <h1 className="text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary transform -rotate-6 mb-8 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                        IT'S A MATCH!
                    </h1>

                    <div className="flex justify-center gap-6 items-center mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-[0_0_30px_rgba(0,255,255,0.4)] relative z-10">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800" alt="You" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                        </div>
                        <div className="flex flex-col items-center justify-center z-20">
                            <div className="text-4xl font-black text-white italic shadow-black drop-shadow-lg">94%</div>
                            <Music size={20} className="text-primary animate-bounce mt-1" />
                        </div>
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10 transition-transform group-hover:scale-105">
                                <img src={matchedUser.photos?.[0]} alt={matchedUser.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-300 text-lg mb-6">
                        You and <span className="text-primary font-bold">{matchedUser.name}</span> both vibe to <span className="text-white italic">The Weeknd</span>.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {['Pop', 'R&B', 'Hip Hop'].map(genre => (
                            <span key={genre} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-primary font-bold">
                                {genre}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <Button className="w-full text-lg py-4 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]" onClick={() => window.location.href = '/conversations'}>
                            Send a Message
                        </Button>
                        <Button variant="outline" className="w-full border-white/20 hover:bg-white/5" onClick={onClose}>
                            Keep Swiping
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MatchModal;
