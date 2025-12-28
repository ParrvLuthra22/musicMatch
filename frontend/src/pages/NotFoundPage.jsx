import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Disc } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center space-y-8 max-w-lg">
                <div className="relative inline-block group">
                    <Disc size={120} className="text-gray-800 animate-spin-slow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-black text-primary font-display">404</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tighter">
                        This page hit the <span className="text-primary text-glow">wrong note</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        The page you're looking for seems to be off-key or doesn't exist anymore.
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <Button onClick={() => navigate('/dashboard')} size="lg">
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
