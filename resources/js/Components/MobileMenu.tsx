import React from 'react';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    userRole: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, userRole }) => {
    if (!isOpen) return null;

    const menuItems = [
        { label: 'Dashboard', href: '/dashboard', roles: ['admin', 'manager', 'sales', 'support'] },
        { label: 'Leads', href: '/leads', roles: ['admin', 'manager', 'sales'] },
        { label: 'Products', href: '/products', roles: ['admin', 'manager'] },
        { label: 'Projects', href: '/projects', roles: ['admin', 'manager', 'sales'] },
        { label: 'Customers', href: '/customers', roles: ['admin', 'manager', 'sales', 'support'] },
        { label: 'Reports', href: '/reports', roles: ['admin', 'manager'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Menu</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    <nav className="space-y-2">
                        {filteredItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                onClick={onClose}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
