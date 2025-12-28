import React from 'react';

const Badge = ({
    children,
    variant = 'default',
    className = '',
    icon: Icon,
    ...props
}) => {
    const variants = {
        default: "bg-white/10 text-white border-white/10",
        outline: "bg-transparent border-white/20 text-gray-300",
        primary: "bg-primary/10 text-primary border-primary/20",
        success: "bg-green-500/10 text-green-400 border-green-500/20",
        warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        danger: "bg-red-500/10 text-red-400 border-red-500/20",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon size={12} />}
            {children}
        </span>
    );
};

export default Badge;
