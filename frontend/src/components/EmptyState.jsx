import React from 'react';
import { Music } from 'lucide-react';

const EmptyState = ({
    icon: Icon = Music,
    title = 'Nothing here yet',
    description = 'Start exploring to find your rhythm.',
    actionLabel,
    onAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-500 w-full h-full min-h-[40vh]">
            <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-500" />
                <div className="relative p-6 bg-bg-surface border border-white/10 rounded-full">
                    <Icon size={48} className="text-primary" />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white font-display mb-3 tracking-tight">{title}</h3>
            <p className="text-gray-400 max-w-sm mb-8 font-body leading-relaxed">{description}</p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-8 py-3 bg-primary text-black hover:bg-primary-hover rounded-xl font-bold font-display tracking-wide shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all transform hover:-translate-y-1"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
