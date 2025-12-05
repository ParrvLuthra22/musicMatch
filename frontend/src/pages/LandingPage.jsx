import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-md"
            >
                <h1 className="text-5xl font-bold mb-6 tracking-tight">TuneMate</h1>
                <p className="text-xl text-gray-300 mb-8">
                    Find your perfect match through the music you love.
                </p>

                <div className="space-y-4 w-full">
                    {user ? (
                        <Link
                            to="/discover"
                            className="block w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold text-lg transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="block w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold text-lg transition-colors"
                            >
                                Create Account
                            </Link>
                            <Link
                                to="/login"
                                className="block w-full py-3 px-6 bg-transparent border border-gray-500 hover:border-white rounded-full font-semibold text-lg transition-colors"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
