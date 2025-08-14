import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links?: PaginationLink[];
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ links, meta, className = '' }) => {
    // Return null if meta is undefined or if we only have one page
    if (!meta || !links || meta.last_page <= 1) {
        return null;
    }

    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${className}`}>
            <div className="text-sm text-gray-700 dark:text-gray-400 order-2 sm:order-1">
                <span className="hidden sm:inline">Showing </span>
                <span className="font-medium">{meta.from || 0}</span>
                <span className="hidden sm:inline"> to </span>
                <span className="sm:hidden">-</span>
                <span className="font-medium">{meta.to || 0}</span>
                <span className="hidden sm:inline"> of </span>
                <span className="sm:hidden">/</span>
                <span className="font-medium">{meta.total || 0}</span>
                <span className="hidden sm:inline"> results</span>
            </div>

            <nav className="flex space-x-1 order-1 sm:order-2">
                {links.map((link, index) => {
                    // Hide text labels on mobile, show only numbers and arrows
                    const isArrow = link.label.includes('Previous') || link.label.includes('Next');
                    const isNumber = /^\d+$/.test(link.label);

                    // On mobile, only show first, last, prev, next, and current page
                    if (window.innerWidth < 640 && !isArrow && !link.active && !isNumber) {
                        return null;
                    }

                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="px-2 sm:px-3 py-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded cursor-not-allowed"
                            >
                                {isArrow ? (
                                    link.label.includes('Previous') ? '‹' : '›'
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-2 sm:px-3 py-2 text-sm rounded transition-colors duration-200 ${
                                link.active
                                    ? 'bg-blue-500 text-white shadow'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                            }`}
                            preserveState
                            preserveScroll
                        >
                            {isArrow ? (
                                link.label.includes('Previous') ? '‹' : '›'
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Pagination;
