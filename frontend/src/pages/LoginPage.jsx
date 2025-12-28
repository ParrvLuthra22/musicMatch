
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Music, ArrowRight, Disc } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/discover');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpotifyLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL} /api/auth / spotify`;
    };

    return (
        <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center p-6 relative overflow-hidden font-body">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* Vinyl Pattern (Subtle CSS) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ background: 'repeating-radial-gradient(#222 0 1px, transparent 1px 4px)' }}>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <Music className="w-12 h-12 text-brand-cyan mx-auto animate-pulse" />
                    </Link>
                    <h2 className="text-4xl font-bold font-display tracking-tight text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Login to continue your musical journey.</p>
                </div>

                <Card variant="glass" className="p-8 shadow-2xl border-white/10 backdrop-blur-2xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="flex justify-end mt-2">
                                <Link to="#" className="text-xs text-brand-cyan hover:text-brand-cyan-hover transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <Button type="submit" className="w-full text-lg shadow-[0_0_20px_rgba(0,240,255,0.2)]" isLoading={isLoading}>
                            Login
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-gray-500 bg-[#0a0a0a]">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSpotifyLogin}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(29,185,84,0.3)] transform active:scale-95"
                    >
                        <Disc size={20} /> Login with Spotify
                    </button>
                </Card>

                <p className="text-center mt-8 text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-brand-cyan font-bold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

