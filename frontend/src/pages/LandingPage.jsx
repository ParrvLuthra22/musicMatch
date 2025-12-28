import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Music, Heart, MessageCircle, Mic2, Radio, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const { user } = useContext(AuthContext);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark text-white font-body selection:bg-brand-cyan selection:text-black overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-[10%] text-brand-cyan/20 hidden md:block"
                >
                    <Music size={120} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 left-[10%] text-brand-cyan/20 hidden md:block"
                >
                    <Radio size={80} />
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    className="text-center max-w-4xl relative z-10"
                >
                    <Badge className="mb-6 mx-auto bg-brand-cyan/10 text-brand-cyan px-4 py-1.5 border-brand-cyan/20 rounded-full text-sm font-semibold tracking-wider uppercase">
                        The #1 Music Dating App
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter font-display leading-[1.1]">
                        Find Your Perfect Match <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-cyan to-white animate-text-shimmer bg-[length:200%_auto]">
                            Through Music
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Stop swiping on selfies. Connect on a deeper level by matching with people who share your vibe, your taste, and your playlists.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
                        {user ? (
                            <Link to="/discover" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full text-lg shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full text-lg shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                                        Start Matching Free
                                    </Button>
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="w-full text-lg border-white/20 hover:bg-white/5">
                                        Login
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section className="py-24 bg-bg-surface border-y border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">How TuneMate Works</h2>
                        <p className="text-gray-400">Three simple steps to find your concert buddy.</p>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: Music, title: "Connect Spotify", desc: "Link your account to securely analyze your top artists, genres, and listening habits." },
                            { icon: Heart, title: "Get Matched", desc: "Our algorithm finds people with compatible music tastes and vibe scores." },
                            { icon: MessageCircle, title: "Vibe Together", desc: "Chat, share songs, and plan your next concert date with someone who gets it." }
                        ].map((step, index) => (
                            <motion.div key={index} variants={fadeIn} className="relative group">
                                <Card variant="default" className="h-full flex flex-col items-center text-center p-8 hover:border-brand-cyan/50 transition-colors duration-300">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <step.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 font-display">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>

                                    {/* Step Number Background */}
                                    <span className="absolute top-4 right-6 text-6xl font-display font-bold text-white/5 pointer-events-none select-none">
                                        {index + 1}
                                    </span>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">More Than Just<br />A Music Match.</h2>
                    <p className="text-xl text-gray-400 max-w-2xl">TuneMate gives you the tools to create genuine connections through the universal language of music.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card variant="glass" className="md:col-span-2 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 group cursor-default">
                        <div className="flex-1">
                            <div className="inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-400 mb-6">
                                <Radio size={24} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-display">Deep Music Analysis</h3>
                            <p className="text-gray-400 text-lg mb-6">We don't just look at genres. We analyze BPM, mood, danceability, and obscure artist overlaps to calculate a true compatibility score.</p>
                        </div>
                        <div className="w-full md:w-1/2 aspect-video bg-gradient-to-br from-purple-900/40 to-black rounded-xl border border-white/10 relative overflow-hidden group-hover:border-purple-500/30 transition-colors">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full px-6 space-y-3">
                                    <div className="h-2 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                                    <div className="h-2 bg-white/10 rounded-full w-full animate-pulse delay-75"></div>
                                    <div className="h-2 bg-white/10 rounded-full w-5/6 animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card variant="glass" className="p-8 group hover:bg-white/5 transition-colors">
                        <div className="p-3 w-fit rounded-xl bg-green-500/10 text-green-400 mb-6">
                            <Mic2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 font-display">Concert Meetups</h3>
                        <p className="text-gray-400">See who's going to the same gigs as you. Never go to a concert alone again.</p>
                    </Card>

                    <Card variant="glass" className="p-8 group hover:bg-white/5 transition-colors">
                        <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 mb-6">
                            <MessageCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 font-display">Real-time Chat</h3>
                        <p className="text-gray-400">Instant messaging with song sharing capabilities built right in.</p>
                    </Card>

                    <Card variant="glass" className="md:col-span-2 p-8 group hover:bg-white/5 transition-colors flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="p-3 w-fit rounded-xl bg-orange-500/10 text-orange-400 mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 font-display">Community First</h3>
                            <p className="text-gray-400 max-w-lg">Join a community of music lovers who believe that the best relationships start with a great song.</p>
                        </div>
                        <Link to="/register">
                            <Button variant="outline" className="group-hover:bg-brand-cyan group-hover:text-black group-hover:border-brand-cyan transition-all">
                                Join the Community <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </Card>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-white/10 py-12 bg-black">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <h2 className="text-2xl font-bold font-display tracking-tighter mb-2">
                            Tune<span className="text-brand-cyan">Mate</span>
                        </h2>
                        <p className="text-sm text-gray-500">© 2024 TuneMate Inc. All rights reserved.</p>
                    </div>

                    <div className="flex gap-8 text-sm text-gray-400">
                        <a href="#" className="hover:text-brand-cyan transition-colors">Privacy</a>
                        <a href="#" className="hover:text-brand-cyan transition-colors">Terms</a>
                        <a href="#" className="hover:text-brand-cyan transition-colors">Safety</a>
                        <a href="#" className="hover:text-brand-cyan transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Simple internal Badge component if not imported to avoid errors
const Badge = ({ children, className }) => (
    <span className={`inline-block ${className}`}>{children}</span>
);

export default LandingPage;
