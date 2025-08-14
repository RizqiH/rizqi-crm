import { useState, useEffect } from 'react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

        useEffect(() => {
        setMounted(true);

        // Get initial theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;

        console.log('Theme Initialize Debug:', {
            savedTheme,
            prefersDark,
            initialDark,
            documentCurrentlyHasDark: document.documentElement.classList.contains('dark')
        });

        setIsDark(initialDark);

        // Apply theme to document
        if (initialDark) {
            document.documentElement.classList.add('dark');
            console.log('Added dark class during init');
        } else {
            document.documentElement.classList.remove('dark');
            console.log('Removed dark class during init');
        }
    }, []);

            const toggleTheme = () => {
        const newIsDark = !isDark;

        console.log('Theme Toggle Debug:', {
            currentIsDark: isDark,
            newIsDark: newIsDark,
            documentHasDarkClass: document.documentElement.classList.contains('dark'),
            currentThemeInStorage: localStorage.getItem('theme'),
            htmlElement: document.documentElement,
            allClasses: Array.from(document.documentElement.classList)
        });

        setIsDark(newIsDark);

        if (newIsDark) {
            // Force remove any conflicting classes and add dark
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            console.log('Applied dark theme');
        } else {
            // Force remove dark and ensure clean state
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
            console.log('Applied light theme');
        }

        // Force a style recalculation to ensure CSS changes apply
        window.requestAnimationFrame(() => {
            // This ensures the style changes are applied immediately
        });

        // Double check after change
        setTimeout(() => {
            console.log('After toggle:', {
                documentHasDarkClass: document.documentElement.classList.contains('dark'),
                documentHasLightClass: document.documentElement.classList.contains('light'),
                storedTheme: localStorage.getItem('theme'),
                componentState: newIsDark,
                allClasses: Array.from(document.documentElement.classList),
                computedBackgroundColor: window.getComputedStyle(document.body).backgroundColor
            });
        }, 100);
    };

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className={`relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 ${className}`}>
                <div className="h-6 w-6 rounded-full bg-white shadow transform transition ease-in-out duration-200" />
            </div>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDark ? 'bg-blue-600' : 'bg-gray-300'
            } ${className}`}
            aria-label="Toggle theme"
        >
            <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-7' : 'translate-x-1'
                }`}
            >
                <span className="flex h-full w-full items-center justify-center">
                    {isDark ? (
                        <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </span>
            </span>
        </button>
    );
}
