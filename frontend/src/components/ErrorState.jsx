import React from 'react';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import Button from './ui/Button';

const ErrorState = ({
    type = 'default', // 'default' | 'network'
    title,
    description,
    onRetry
}) => {
    const isNetwork = type === 'network';
    const Icon = isNetwork ? WifiOff : AlertCircle;

    const defaultTitle = isNetwork ? "No Connection" : "Something went wrong";
    const defaultDesc = isNetwork
        ? "Check your internet connection and try again."
        : "We encountered an error while loading this content.";

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
                <Icon size={48} className="text-red-500" />
            </div>

            <h3 className="text-2xl font-bold text-white font-display mb-3">
                {title || defaultTitle}
            </h3>

            <p className="text-gray-400 max-w-md mb-8">
                {description || defaultDesc}
            </p>

            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500"
                >
                    <RefreshCw size={18} className="mr-2" />
                    Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorState;
