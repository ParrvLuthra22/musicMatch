import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const LazyImage = ({ src, alt, className = '', ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => setHasError(true);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-surface border border-white/5 animate-pulse z-10">
                    <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
                </div>
            )}

            {hasError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-surface border border-white/5 text-gray-600 text-xs">
                    Failed to load
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    {...props}
                />
            )}
        </div>
    );
};

export default LazyImage;
