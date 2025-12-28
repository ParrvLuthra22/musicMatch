import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-shimmer bg-bg-surface rounded-xl ${className}`}
            {...props}
        />
    );
};

export { Skeleton };
