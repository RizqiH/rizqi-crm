import React from 'react';

interface ChartData {
    label: string;
    value: number;
    color?: string;
}

interface SimpleChartProps {
    data: ChartData[];
    title: string;
    type: 'bar' | 'line' | 'pie';
    className?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data, title, type, className = '' }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    if (type === 'bar') {
        return (
            <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-20 text-sm text-gray-600 mr-4">
                                {item.label}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                                <div
                                    className={`h-4 rounded-full ${
                                        item.color || 'bg-blue-500'
                                    }`}
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                ></div>
                                <span className="absolute right-2 top-0 text-xs text-gray-700 leading-4">
                                    {item.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'pie') {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        return (
            <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div className="flex items-center justify-between">
                    <div className="w-32 h-32 relative">
                        {/* Simple pie chart representation */}
                        <div className="w-32 h-32 rounded-full bg-gray-200 relative overflow-hidden">
                            {data.map((item, index) => {
                                const percentage = (item.value / total) * 100;
                                return (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 ${
                                            item.color || `bg-blue-${(index + 1) * 100}`
                                        }`}
                                        style={{
                                            clipPath: `polygon(50% 50%, 50% 0%, ${
                                                50 + (percentage / 100) * 50
                                            }% 0%)`
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex-1 ml-6 space-y-2">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className={`w-3 h-3 rounded mr-2 ${
                                            item.color || 'bg-blue-500'
                                        }`}
                                    ></div>
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                </div>
                                <span className="text-sm font-medium">
                                    {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Line chart (simplified)
    return (
        <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="h-32 flex items-end space-x-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                            className={`w-full ${item.color || 'bg-blue-500'} rounded-t`}
                            style={{ height: `${(item.value / maxValue) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2 text-center">
                            {item.label}
                        </span>
                        <span className="text-xs font-medium">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleChart;
