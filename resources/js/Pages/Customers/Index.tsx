import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Pagination from '@/Components/UI/Pagination';

interface Lead {
    id: number;
    name: string;
    company: string;
}

interface Customer {
    id: number;
    customer_code: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: string;
    registration_date: string;
    created_at: string;
    lead?: {
        id: number;
        name: string;
        company: string;
    };
    services: Array<{
        id: number;
        service_number: string;
        status: string;
        activation_date: string;
        monthly_fee: number;
        product: {
            id: number;
            name: string;
        };
    }>;
}

interface PaginatedCustomers {
    data: Customer[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

interface Props {
    customers: PaginatedCustomers;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ customers, filters }: Props) {
    // Ensure customers data is properly structured with defaults
    const safeCustomers = {
        data: customers?.data || [],
        meta: customers?.meta || {
            current_page: 1,
            from: 0,
            last_page: 1,
            per_page: 10,
            to: 0,
            total: 0
        },
        links: customers?.links || []
    };

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        const filterData: Record<string, string> = {};

        if (search.trim()) filterData.search = search.trim();
        if (status) filterData.status = status;

        router.get(route('customers.index'), filterData);
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        router.get(route('customers.index'));
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            router.delete(route('customers.destroy', id));
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            'active': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
            'inactive': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
            'suspended': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
            'trial': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Customer Management
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage customer accounts and service subscriptions
                        </p>
                    </div>
                    <Link href={route('customers.create')}>
                        <Button>Create Customer</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Customers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search customers..."
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="trial">Trial</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleFilter} className="flex-1">
                                        Filter
                                    </Button>
                                    <Button variant="secondary" onClick={handleClearFilters} className="flex-1">
                                        Clear
                                    </Button>
                                </div>
                            </div>

                            {/* Results Summary */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {safeCustomers.data.length} of {safeCustomers.meta.total} customers
                                </p>
                            </div>

                            {/* Customer Cards */}
                            <div className="space-y-4">
                                {safeCustomers.data.length > 0 ? (
                                    <>
                                        {safeCustomers.data.map((customer) => (
                                            <div key={customer.id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                {customer.name}
                                                            </h3>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                                {customer.customer_code}
                                                            </span>
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                                                                {customer.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        {customer.company && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                                {customer.company}
                                                            </p>
                                                        )}
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                            <span>{customer.email}</span>
                                                            {customer.phone && <span>{customer.phone}</span>}
                                                            <span>Joined: {formatDate(customer.registration_date)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Services */}
                                                {customer.services.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Active Services ({customer.services.length})
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                            {customer.services.map((service) => (
                                                                <div key={service.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                            {service.product.name}
                                                                        </span>
                                                                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(service.status)}`}>
                                                                            {service.status}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                        <div>Service: {service.service_number}</div>
                                                                        <div>Fee: {formatCurrency(service.monthly_fee)}/month</div>
                                                                        <div>Active: {formatDate(service.activation_date)}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="flex gap-2 mb-2 sm:mb-0">
                                                        <Link href={route('customers.show', customer.id)}>
                                                            <Button variant="secondary" className="text-sm">
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('customers.edit', customer.id)}>
                                                            <Button variant="secondary" className="text-sm">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        {customer.lead && (
                                                            <Link href={route('leads.show', customer.lead.id)}>
                                                                <Button variant="secondary" className="text-sm">
                                                                    View Lead
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleDelete(customer.id)}
                                                            className="text-sm"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Pagination */}
                                        <div className="mt-6">
                                            <Pagination
                                                links={customers.links.map(link => ({
                                                    ...link,
                                                    url: link.url || undefined
                                                }))}
                                                meta={customers.meta}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">No customers found</div>
                                        <Link href={route('customers.create')}>
                                            <Button>Create Your First Customer</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
