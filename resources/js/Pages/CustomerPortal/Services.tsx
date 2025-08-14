import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

interface CustomerService {
    id: number;
    service_number: string;
    product: {
        id: number;
        name: string;
        type: string;
        speed_mbps?: number;
    };
    status: string;
    activation_date: string;
    expiry_date: string | null;
    monthly_fee: number;
    installation_notes?: string;
    technical_notes?: string;
}

interface ServicesProps extends PageProps {
    customer: {
        id: number;
        name: string;
        customer_code: string;
    };
    services: CustomerService[];
}

export default function Services({ customer, services }: ServicesProps) {
    const [filter, setFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'suspended':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'terminated':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'suspended':
                return (
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            case 'terminated':
                return (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const filteredServices = services.filter(service => {
        const matchesFilter = filter === 'all' || service.status.toLowerCase() === filter;
        const matchesSearch = service.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            service.service_number.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const activeServices = services.filter(s => s.status === 'active').length;
    const suspendedServices = services.filter(s => s.status === 'suspended').length;
    const terminatedServices = services.filter(s => s.status === 'terminated').length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="My Services" />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
                            <p className="text-gray-600">Manage your active services and subscriptions</p>
                        </div>
                        <div className="flex space-x-4">
                            <a
                                href="/customer-portal/dashboard"
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                                Back to Dashboard
                            </a>
                            <a
                                href="/customer-portal/support"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Get Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-md">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Services</p>
                                <p className="text-2xl font-semibold text-gray-900">{services.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-md">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active</p>
                                <p className="text-2xl font-semibold text-gray-900">{activeServices}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-md">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Suspended</p>
                                <p className="text-2xl font-semibold text-gray-900">{suspendedServices}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-md">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Terminated</p>
                                <p className="text-2xl font-semibold text-gray-900">{terminatedServices}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                                        filter === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All Services
                                </button>
                                <button
                                    onClick={() => setFilter('active')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                                        filter === 'active'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setFilter('suspended')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                                        filter === 'suspended'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Suspended
                                </button>
                                <button
                                    onClick={() => setFilter('terminated')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                                        filter === 'terminated'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Terminated
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Services ({filteredServices.length})
                        </h3>
                    </div>
                    <div className="p-6">
                        {filteredServices.length > 0 ? (
                            <div className="space-y-6">
                                {filteredServices.map((service) => (
                                    <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    {getStatusIcon(service.status)}
                                                    <h4 className="text-xl font-semibold text-gray-900">
                                                        {service.product.name}
                                                    </h4>
                                                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(service.status)}`}>
                                                        {service.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Service Number</p>
                                                        <p className="text-sm text-gray-900">{service.service_number}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Service Type</p>
                                                        <p className="text-sm text-gray-900">{service.product.type}</p>
                                                    </div>
                                                    {service.product.speed_mbps && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600">Speed</p>
                                                            <p className="text-sm text-gray-900">{service.product.speed_mbps} Mbps</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Monthly Fee</p>
                                                        <p className="text-sm text-gray-900">${service.monthly_fee.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Activation Date</p>
                                                        <p className="text-sm text-gray-900">
                                                            {new Date(service.activation_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {service.expiry_date && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600">Expiry Date</p>
                                                            <p className="text-sm text-gray-900">
                                                                {new Date(service.expiry_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {(service.installation_notes || service.technical_notes) && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        {service.installation_notes && (
                                                            <div className="mb-2">
                                                                <p className="text-sm font-medium text-gray-600">Installation Notes</p>
                                                                <p className="text-sm text-gray-900">{service.installation_notes}</p>
                                                            </div>
                                                        )}
                                                        {service.technical_notes && (
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-600">Technical Notes</p>
                                                                <p className="text-sm text-gray-900">{service.technical_notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                                                <div className="flex flex-col space-y-2">
                                                    <a
                                                        href="/customer-portal/support"
                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Get Support
                                                    </a>
                                                    <a
                                                        href="/customer-portal/billing"
                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2z" />
                                                        </svg>
                                                        View Billing
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter.' : 'You don\'t have any services yet.'}
                                </p>
                                {(!searchTerm && filter === 'all') && (
                                    <div className="mt-6">
                                        <a
                                            href="/customer-portal/support"
                                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                        >
                                            Contact Support for New Services
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
