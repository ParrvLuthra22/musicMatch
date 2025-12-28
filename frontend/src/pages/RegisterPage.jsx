import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Music, ArrowRight, Disc } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await register(name, email, password);
            navigate('/discover');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpotifyLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/spotify`;
    };

    return (
        <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center p-6 relative overflow-hidden font-body">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* Vinyl Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ background: 'repeating-radial-gradient(#222 0 1px, transparent 1px 4px)' }}>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <Music className="w-12 h-12 text-brand-cyan mx-auto animate-pulse" />
                    </Link>
                    <h2 className="text-4xl font-bold font-display tracking-tight text-white mb-2">Join TuneMate</h2>
                    <p className="text-gray-400">Discover your music soulmate today.</p>
                </div>

                <Card variant="glass" className="p-8 shadow-2xl border-white/10 backdrop-blur-2xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" className="w-full text-lg shadow-[0_0_20px_rgba(0,240,255,0.2)] mt-4" isLoading={isLoading}>
                            Create Account
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
                        <Disc size={20} /> Continue with Spotify
                    </button>
                </Card>

                <p className="text-center mt-8 text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-cyan font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
