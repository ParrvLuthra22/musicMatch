import React from 'react';

const Slider = ({ value, min = 0, max = 100, step = 1, onChange, className = '', ...props }) => {
    // Calculate percentage for background gradient
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={`relative w-full h-6 flex items-center ${className}`}>
            <div className="absolute w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-150"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                {...props}
            />
            <div
                className="pointer-events-none absolute w-5 h-5 bg-white border-2 border-primary rounded-full shadow-lg transition-all duration-150 transform -translate-x-1/2"
                style={{ left: `${percentage}%` }}
            />
        </div>
    );
};

export default Slider;
