import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/discover');
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed');
        }
    };

    const handleSpotifyLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/spotify`;
    };

    return (
        <div className="min-h-screen bg-brand-black text-white flex items-center justify-center p-6 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-brand-cyan/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-brand-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl relative z-10"
            >
                <h2 className="text-3xl font-bold mb-2 text-center tracking-tight">Create Account</h2>
                <p className="text-center text-gray-400 mb-8 text-sm">Join the TuneMate community</p>

                <button
                    onClick={handleSpotifyLogin}
                    className="w-full py-3.5 px-6 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-xl mb-6 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                >
                    Sign up with Spotify
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-brand-surface text-gray-500">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3.5 bg-brand-black border border-white/10 rounded-xl focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all placeholder:text-gray-700"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3.5 bg-brand-black border border-white/10 rounded-xl focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all placeholder:text-gray-700"
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3.5 bg-brand-black border border-white/10 rounded-xl focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all placeholder:text-gray-700"
                            placeholder="Create a strong password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3.5 bg-brand-cyan hover:bg-brand-cyan-hover text-brand-black rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] mt-2"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Already have an account? <Link to="/login" className="text-brand-cyan hover:text-white transition-colors font-medium">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
