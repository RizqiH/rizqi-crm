import React from 'react';

interface TableColumn<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    onSort?: (column: string, direction: 'asc' | 'desc') => void;
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    className?: string;
    emptyMessage?: string;
}

function Table<T extends Record<string, any>>({
    data,
    columns,
    onSort,
    sortColumn,
    sortDirection,
    className = '',
    emptyMessage = 'No data available'
}: TableProps<T>) {
    const handleSort = (column: TableColumn<T>) => {
        if (!column.sortable || !onSort) return;

        const direction = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
        onSort(column.key as string, direction);
    };

    const getValue = (row: T, key: keyof T | string): any => {
        if (typeof key === 'string' && key.includes('.')) {
            return key.split('.').reduce((obj, k) => obj?.[k], row);
        }
        return row[key as keyof T];
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
            {/* Mobile Card View */}
            <div className="block md:hidden">
                {!data || data.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((row, index) => (
                            <div key={index} className="p-4 space-y-3">
                                {columns.map((column) => (
                                    <div key={column.key as string} className="flex justify-between items-start">
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-0 flex-1 mr-4">
                                            {column.label}
                                        </dt>
                                        <dd className="text-sm text-gray-900 dark:text-gray-100 text-right">
                                            {column.render
                                                ? column.render(getValue(row, column.key), row)
                                                : getValue(row, column.key)
                                            }
                                        </dd>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key as string}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                                        column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                                    } ${column.className || ''}`}
                                    onClick={() => handleSort(column)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.label}</span>
                                        {column.sortable && sortColumn === column.key && (
                                            <span className="text-xs">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {!data || data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key as string}
                                            className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                                        >
                                            {column.render
                                                ? column.render(getValue(row, column.key), row)
                                                : getValue(row, column.key)
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
