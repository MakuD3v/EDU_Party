import React from 'react';

const BrawlButton = ({ children, onClick, variant = 'primary', size = 'md', className = '' }) => {
    const baseClasses = 'font-display font-bold rounded-xl border-4 shadow-cartoony transition-all bounce-hover cursor-pointer text-center';

    const variants = {
        primary: 'bg-cartoony-yellow border-yellow-600 text-cartoony-dark hover:bg-yellow-400',
        blue: 'bg-cartoony-blue border-blue-700 text-white hover:bg-blue-400',
        red: 'bg-cartoony-red border-red-700 text-white hover:bg-red-400',
        green: 'bg-cartoony-green border-green-700 text-white hover:bg-green-400',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-lg',
        lg: 'px-8 py-4 text-2xl',
        xl: 'px-12 py-6 text-4xl',
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
};

export default BrawlButton;
