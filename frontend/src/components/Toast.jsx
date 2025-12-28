import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: {
            icon: <CheckCircle size={20} className="text-black" />, // Black icon on Cyan bg? Or Cyan icon? User said "Dark background, cyan left border, checkmark icon"
            border: 'border-l-4 border-l-primary', // Cyan
            iconColor: 'text-primary'
        },
        error: {
            icon: <AlertCircle size={20} className="text-red-500" />,
            border: 'border-l-4 border-l-red-500',
            iconColor: 'text-red-500'
        },
        info: {
            icon: <Info size={20} className="text-blue-500" />,
            border: 'border-l-4 border-l-blue-500',
            iconColor: 'text-blue-500'
        }
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div className={`flex items-center gap-3 p-4 rounded-r-xl bg-bg-card border-y border-r border-white/10 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 ${currentStyle.border} min-w-[300px]`}>
            <div className={`${currentStyle.iconColor}`}>
                {currentStyle.icon}
            </div>
            <p className="flex-1 text-white font-medium text-sm">{message}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
