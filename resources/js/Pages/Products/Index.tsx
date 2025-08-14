import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Table from '@/Components/UI/Table';
import Pagination from '@/Components/UI/Pagination';
import { useTableFilters } from '@/hooks/useTableFilters';
import { Product, PaginatedData, ProductFilters } from '@/types';

interface Props {
    products: PaginatedData<Product>;
    filters: ProductFilters;
}

const ProductsIndex: React.FC<Props> = ({ products, filters }) => {
    const { filters: searchFilters, updateFilters } = useTableFilters(filters, {
        routeName: 'products.index',
    });

    const typeOptions = [
        { value: '', label: 'All Types' },
        { value: 'internet', label: 'Internet' },
        { value: 'cable_tv', label: 'Cable TV' },
        { value: 'voip', label: 'VoIP' },
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const formatPrice = (price: number, cycle: string): string => {
        return `Rp ${new Intl.NumberFormat('id-ID').format(price)} / ${cycle}`;
    };

    const formatType = (type: string): string => {
        return type.replace('_', ' ').toUpperCase();
    };

    const renderStatus = (isActive: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
        }`}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );

    const renderActions = (product: Product) => (
        <div className="flex space-x-2">
            <Link
                href={route('products.show', product.id)}
                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            >
                View
            </Link>
            <Link
                href={route('products.edit', product.id)}
                className="text-green-600 hover:text-green-900 text-sm font-medium"
            >
                Edit
            </Link>
        </div>
    );

    const columns = [
        {
            key: 'name',
            label: 'Product',
            render: (value: string, product: Product) => (
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                    </p>
                    {product.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {product.description.length > 50
                                ? `${product.description.substring(0, 50)}...`
                                : product.description
                            }
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'type',
            label: 'Type',
            render: (value: string) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {formatType(value)}
                </span>
            ),
        },
        {
            key: 'price',
            label: 'Price',
            render: (value: number, product: Product) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {formatPrice(value, product.billing_cycle)}
                </span>
            ),
        },
        {
            key: 'speed_mbps',
            label: 'Speed',
            render: (value: number) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {value ? `${value} Mbps` : '-'}
                </span>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (value: boolean) => renderStatus(value),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, product: Product) => renderActions(product),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Products / Services
                    </h2>
                    <Link href={route('products.create')}>
                        <Button variant="primary">
                            Add New Product
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Search and Filters */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchFilters.search || ''}
                                        onChange={(e) => updateFilters({ search: e.target.value }, true)}
                                    />
                                </div>
                                <div className="sm:w-48">
                                    <Select
                                        options={typeOptions}
                                        value={searchFilters.type || ''}
                                        onChange={(e) => updateFilters({ type: e.target.value })}
                                    />
                                </div>
                                <div className="sm:w-48">
                                    <Select
                                        options={statusOptions}
                                        value={searchFilters.status || ''}
                                        onChange={(e) => updateFilters({ status: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Products Table */}
                            <Table
                                data={products.data}
                                columns={columns}
                                emptyMessage="No products found. Create your first product to get started."
                            />

                            {/* Pagination */}
                            {products.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination
                                        links={products.links}
                                        meta={products.meta}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProductsIndex;
