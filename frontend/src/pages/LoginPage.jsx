import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setToken(token);
            window.location.href = '/'; // Force reload to update auth state
        }
    }, [searchParams, setToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed');
        }
    };

    const handleSpotifyLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/spotify`;
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <h2 className="text-3xl font-bold mb-8 text-center">Welcome Back</h2>

                <button
                    onClick={handleSpotifyLogin}
                    className="w-full py-3 px-6 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full mb-6 flex items-center justify-center gap-2 transition-colors"
                >
                    Login with Spotify
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-black text-gray-500">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-bold transition-colors"
                    >
                        Log In
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-500">
                    Don't have an account? <Link to="/register" className="text-purple-500 hover:text-purple-400">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
