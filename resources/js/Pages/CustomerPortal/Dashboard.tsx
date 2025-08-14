import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

interface CustomerService {
    id: number;
    name: string;
    status: string;
    service_number: string;
    created_at: string;
}

interface CustomerBilling {
    total_amount: number;
    outstanding_balance: number;
    last_payment_date: string | null;
    next_due_date: string | null;
}

interface CustomerTicket {
    id: number;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
}

interface DashboardProps extends PageProps {
    customer: {
        id: number;
        name: string;
        email: string;
        phone: string;
        customer_code: string;
    };
    services: CustomerService[];
    billing: CustomerBilling;
    recentTickets: CustomerTicket[];
}

export default function Dashboard({ customer, services, billing, recentTickets }: DashboardProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'suspended':
                return 'bg-yellow-100 text-yellow-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Customer Dashboard" />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome, {customer.name}
                            </h1>
                            <p className="text-gray-600">Customer ID: {customer.customer_code}</p>
                        </div>
                        <div className="flex space-x-4">
                            <a
                                href="/customer-portal/services"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Manage Services
                            </a>
                            <a
                                href="/customer-portal/support"
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                Get Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-md">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Services</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {services.filter(s => s.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-md">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    ${billing.outstanding_balance.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-md">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Next Due Date</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {billing.next_due_date ? new Date(billing.next_due_date).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-md">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {recentTickets.filter(t => t.status !== 'closed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Services */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Your Services</h3>
                        </div>
                        <div className="p-6">
                            {services.length > 0 ? (
                                <div className="space-y-4">
                                    {services.slice(0, 5).map((service) => (
                                        <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{service.name}</h4>
                                                <p className="text-sm text-gray-600">Service #{service.service_number}</p>
                                                <p className="text-xs text-gray-500">
                                                    Added {new Date(service.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                                                {service.status}
                                            </span>
                                        </div>
                                    ))}
                                    {services.length > 5 && (
                                        <a
                                            href="/customer-portal/services"
                                            className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View all services →
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No services found.</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Support Tickets */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Recent Support Tickets</h3>
                        </div>
                        <div className="p-6">
                            {recentTickets.length > 0 ? (
                                <div className="space-y-4">
                                    {recentTickets.map((ticket) => (
                                        <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                                                <p className="text-xs text-gray-500">
                                                    Created {new Date(ticket.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end space-y-1">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                                <span className="text-xs text-gray-600">{ticket.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <a
                                        href="/customer-portal/support"
                                        className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View all tickets →
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">No support tickets found.</p>
                                    <a
                                        href="/customer-portal/support"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Create Support Ticket
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href="/customer-portal/billing"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="p-2 bg-blue-100 rounded-md mr-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">View Billing</h4>
                                    <p className="text-sm text-gray-600">Check invoices and payment history</p>
                                </div>
                            </a>

                            <a
                                href="/customer-portal/services"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="p-2 bg-green-100 rounded-md mr-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Manage Services</h4>
                                    <p className="text-sm text-gray-600">View and manage your services</p>
                                </div>
                            </a>

                            <a
                                href="/customer-portal/support"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="p-2 bg-purple-100 rounded-md mr-4">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Get Support</h4>
                                    <p className="text-sm text-gray-600">Submit tickets and get help</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
