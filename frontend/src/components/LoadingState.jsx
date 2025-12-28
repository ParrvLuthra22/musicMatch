import React from 'react';

const LoadingState = ({ fullScreen = false, message = "Loading vibes..." }) => {

    const content = (
        <div className="flex flex-col items-center gap-6">
            {/* Vinyl Record Animation */}
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
                <div className="absolute inset-4 bg-bg-surface rounded-full flex items-center justify-center border border-white/10">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
            </div>

            <p className="text-gray-400 text-sm font-bold font-display tracking-widest uppercase animate-pulse">
                {message}
            </p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
            {content}
        </div>
    );
};

export default LoadingState;
