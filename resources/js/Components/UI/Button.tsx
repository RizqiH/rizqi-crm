import React from 'react';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    onClick,
    children,
    className = ''
}) => {
    const baseClasses = 'font-bold rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

    const variantClasses = {
        primary: 'bg-blue-500 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-500 hover:bg-gray-700 text-white focus:ring-gray-500',
        danger: 'bg-red-500 hover:bg-red-700 text-white focus:ring-red-500',
        success: 'bg-green-500 hover:bg-green-700 text-white focus:ring-green-500'
    };

    const sizeClasses = {
        sm: 'py-1 px-2 text-sm',
        md: 'py-2 px-4',
        lg: 'py-3 px-6 text-lg'
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
