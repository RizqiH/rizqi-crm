import React from 'react';

interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
    placeholder?: string;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    id?: string;
    name?: string;
    error?: string;
    min?: string | number;
    max?: string | number;
    step?: string | number;
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    placeholder,
    value,
    defaultValue,
    onChange,
    onBlur,
    disabled = false,
    required = false,
    className = '',
    id,
    name,
    error,
    min,
    max,
    step
}) => {
    const baseClasses = 'px-4 py-2 border rounded-md focus:ring-2 focus:ring-offset-1 transition-colors duration-200 dark:text-white';
    const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500';
    const disabledClasses = disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700';

    const classes = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

    return (
        <div className="w-full">
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                required={required}
                min={min}
                max={max}
                step={step}
                className={classes}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;
