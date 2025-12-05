import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        info: <Info size={20} className="text-blue-500" />
    };

    const bgColors = {
        success: 'bg-gray-900 border-green-500/50',
        error: 'bg-gray-900 border-red-500/50',
        info: 'bg-gray-900 border-blue-500/50'
    };

    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-xl animate-slide-up ${bgColors[type]} min-w-[300px]`}>
            {icons[type]}
            <p className="flex-1 text-white font-medium">{message}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
