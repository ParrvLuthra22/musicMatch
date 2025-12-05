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
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
            <div className="p-4 bg-gray-900 rounded-full mb-4">
                <Icon size={48} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 max-w-xs mb-6">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
