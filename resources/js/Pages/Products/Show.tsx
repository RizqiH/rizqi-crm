import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';

interface Product {
    id: number;
    name: string;
    description: string | null;
    type: string;
    price: number;
    billing_cycle: string;
    speed_mbps: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    product: Product;
}

export default function ShowProduct({ product }: Props) {
    const formatPrice = (price: number, cycle: string): string => {
        return `Rp ${new Intl.NumberFormat('id-ID').format(price)} / ${cycle}`;
    };

    const formatType = (type: string): string => {
        return type.replace('_', ' ').toUpperCase();
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Product Details: {product.name}
                    </h2>
                    <div className="flex space-x-3">
                        <Link href={route('products.edit', product.id)}>
                            <Button variant="secondary">
                                Edit Product
                            </Button>
                        </Link>
                        <Link href={route('products.index')}>
                            <Button variant="primary">
                                Back to Products
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Product: ${product.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Status Badge */}
                            <div className="mb-6">
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                    product.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {product.is_active ? 'Active Product' : 'Inactive Product'}
                                </span>
                            </div>

                            {/* Product Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Information */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Basic Information
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Product Name
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {product.name}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Service Type
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {formatType(product.type)}
                                                </p>
                                            </div>

                                            {product.description && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Description
                                                    </label>
                                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Technical */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Pricing & Technical Details
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Price
                                                </label>
                                                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                    {formatPrice(product.price, product.billing_cycle)}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Billing Cycle
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                                                    {product.billing_cycle}
                                                </p>
                                            </div>

                                            {product.speed_mbps && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Internet Speed
                                                    </label>
                                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {product.speed_mbps} Mbps
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    System Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Created At
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {formatDate(product.created_at)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Last Updated
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {formatDate(product.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Highlights */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Product Features
                                </h3>

                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        {product.type === 'internet' && (
                                            <>
                                                <li className="flex items-center">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                                    High-speed internet connection
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                                    24/7 technical support
                                                </li>
                                                <li className="flex items-center">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                                    Free installation and setup
                                                </li>
                                                {product.speed_mbps && product.speed_mbps >= 100 && (
                                                    <li className="flex items-center">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                                        Business-grade connection
                                                    </li>
                                                )}
                                            </>
                                        )}

                                        {product.billing_cycle === 'yearly' && (
                                            <li className="flex items-center">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                                Annual billing discount applied
                                            </li>
                                        )}

                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                            Available for new customers
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

