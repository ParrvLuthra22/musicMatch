import React from 'react';

const Avatar = ({
    src,
    alt,
    className = '',
    size = 'md',
    isOnline = false,
}) => {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24"
    };

    return (
        <div className={`relative ${sizes[size]} ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={alt || "Avatar"}
                    className="w-full h-full rounded-full object-cover border-2 border-white/10"
                />
            ) : (
                <div className="w-full h-full rounded-full bg-bg-surface flex items-center justify-center border-2 border-white/10 text-gray-500 font-bold uppercase">
                    {alt ? alt.substring(0, 2) : '?'}
                </div>
            )}

            {isOnline && (
                <span className="absolute bottom-0 right-0 block w-[15%] h-[15%] rounded-full bg-brand-cyan ring-2 ring-black" />
            )}
        </div>
    );
};

export default Avatar;
