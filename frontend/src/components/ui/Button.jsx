import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'default',
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95";

    const variants = {
        primary: "bg-primary text-black hover:bg-primary-hover shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] border border-transparent",
        outline: "bg-transparent border border-primary text-primary hover:bg-primary/10 shadow-[0_0_10px_rgba(0,255,255,0.1)]",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg",
        link: "text-primary underline-offset-4 hover:underline bg-transparent"
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        default: "h-12 px-6 py-3 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
