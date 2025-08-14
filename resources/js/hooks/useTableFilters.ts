import { useState, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';

interface UseTableFiltersOptions {
    routeName: string;
    preserveState?: boolean;
    preserveScroll?: boolean;
    debounceDelay?: number;
}

export function useTableFilters<T extends Record<string, any>>(
    initialFilters: T,
    options: UseTableFiltersOptions
) {
    const [filters, setFilters] = useState<T>(initialFilters);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateFilters = useCallback((newFilters: Partial<T>, shouldDebounce = false) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);

        const applyFilters = () => {
            router.get(route(options.routeName), updatedFilters, {
                preserveState: options.preserveState ?? true,
                preserveScroll: options.preserveScroll ?? true,
            });
        };

        if (shouldDebounce) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(applyFilters, options.debounceDelay ?? 300);
        } else {
            applyFilters();
        }
    }, [filters, options]);

    const resetFilters = useCallback(() => {
        const resetFilters = Object.keys(initialFilters).reduce((acc, key) => {
            acc[key as keyof T] = '' as T[keyof T];
            return acc;
        }, {} as T);
        updateFilters(resetFilters);
    }, [initialFilters, updateFilters]);

    return {
        filters,
        updateFilters,
        resetFilters,
    };
}
