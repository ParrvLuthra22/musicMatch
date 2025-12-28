import React from 'react';

const Card = ({
    children,
    className = '',
    variant = 'default', // default | glass | outline
}) => {
    const variants = {
        default: "bg-bg-card border border-white/10",
        glass: "bg-bg-card/60 backdrop-blur-xl border border-white/10",
        outline: "bg-transparent border border-white/20",
        cyan: "bg-brand-cyan/5 border border-brand-cyan/20"
    };

    return (
        <div className={`rounded-3xl p-6 ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
