import React from 'react';

const LoadingState = ({ fullScreen = false }) => {
    const bars = [1, 2, 3, 4];

    const content = (
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-end gap-1 h-8">
                {bars.map((i) => (
                    <div
                        key={i}
                        className="w-2 bg-purple-500 rounded-full animate-pulse-slow"
                        style={{
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.1}s`
                        }}
                    />
                ))}
            </div>
            <p className="text-gray-400 text-sm font-medium animate-pulse">Loading vibes...</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {content}
        </div>
    );
};

export default LoadingState;
