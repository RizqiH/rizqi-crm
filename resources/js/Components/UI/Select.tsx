import React from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    id?: string;
    name?: string;
    error?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    disabled = false,
    required = false,
    className = '',
    id,
    name,
    error
}) => {
    const baseClasses = 'px-4 py-2 border rounded-md focus:ring-2 focus:ring-offset-1 transition-colors duration-200 dark:text-white';
    const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500';
    const disabledClasses = disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700';

    const classes = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

    return (
        <div className="w-full">
            <select
                id={id}
                name={name}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={classes}
            >
                {placeholder && (
                    <option value="">{placeholder}</option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Select;
