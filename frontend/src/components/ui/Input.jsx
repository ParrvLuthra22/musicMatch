import React from 'react';

const Input = ({
    label,
    error,
    className = '',
    id,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1 font-display tracking-wide">
                    {label}
                </label>
            )}
            <input
                className={`flex h-12 w-full rounded-xl border border-white/10 bg-bg-surface px-4 py-2 text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : ''
                    } ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>}
        </div>
    );
};

export default Input;
