import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';

interface Invoice {
    id: number;
    invoice_number: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    due_date: string;
    paid_date: string | null;
    created_at: string;
}

interface Payment {
    id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    transaction_id: string;
    status: string;
}

interface BillingProps extends PageProps {
    customer: {
        id: number;
        name: string;
        customer_code: string;
        email: string;
    };
    billing: {
        total_amount: number;
        outstanding_balance: number;
        last_payment_date: string | null;
        next_due_date: string | null;
    };
    invoices: Invoice[];
    payments: Payment[];
}

export default function Billing({ customer, billing, invoices, payments }: BillingProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments'>('overview');

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'pending':
                return (
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'overdue':
                return (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const paidInvoices = invoices.filter(i => i.status === 'paid').length;
    const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
    const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Billing & Payments" />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
                            <p className="text-gray-600">Manage your invoices and payment history</p>
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
                                Billing Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Billing Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-md">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Billed</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    ${billing.total_amount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`p-2 rounded-md ${billing.outstanding_balance > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                                <svg className={`w-6 h-6 ${billing.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                                <p className={`text-2xl font-semibold ${billing.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ${billing.outstanding_balance.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-md">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Last Payment</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {billing.last_payment_date ? new Date(billing.last_payment_date).toLocaleDateString() : 'No payments'}
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
                                <p className="text-lg font-semibold text-gray-900">
                                    {billing.next_due_date ? new Date(billing.next_due_date).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert for Outstanding Balance */}
                {billing.outstanding_balance > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Outstanding Balance Alert</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>You have an outstanding balance of ${billing.outstanding_balance.toLocaleString()}. Please make a payment to avoid service interruption.</p>
                                </div>
                                <div className="mt-4">
                                    <div className="-mx-2 -my-1.5 flex">
                                        <button
                                            type="button"
                                            className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                        >
                                            Contact Support for Payment Options
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                                    activeTab === 'overview'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('invoices')}
                                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                                    activeTab === 'invoices'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Invoices ({invoices.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('payments')}
                                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                                    activeTab === 'payments'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Payment History ({payments.length})
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-green-100 rounded-md">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                                                <p className="text-lg font-semibold text-gray-900">{paidInvoices}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-yellow-100 rounded-md">
                                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                                                <p className="text-lg font-semibold text-gray-900">{pendingInvoices}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-red-100 rounded-md">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
                                                <p className="text-lg font-semibold text-gray-900">{overdueInvoices}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
                                    <div className="space-y-3">
                                        {[
                                            ...invoices.slice(0, 3).map(item => ({ ...item, type: 'invoice' as const })),
                                            ...payments.slice(0, 2).map(item => ({ ...item, type: 'payment' as const }))
                                        ]
                                            .sort((a, b) => {
                                                const dateA = new Date(a.type === 'invoice' ? a.created_at : a.payment_date);
                                                const dateB = new Date(b.type === 'invoice' ? b.created_at : b.payment_date);
                                                return dateB.getTime() - dateA.getTime();
                                            })
                                            .slice(0, 5)
                                            .map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        {item.type === 'invoice' ? (
                                                            <>
                                                                <div className="p-1 bg-blue-100 rounded-md mr-3">
                                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">Invoice {(item as any).invoice_number}</p>
                                                                    <p className="text-xs text-gray-500">{new Date((item as any).created_at).toLocaleDateString()}</p>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="p-1 bg-green-100 rounded-md mr-3">
                                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">Payment Received</p>
                                                                    <p className="text-xs text-gray-500">{new Date((item as any).payment_date).toLocaleDateString()}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">${item.amount.toLocaleString()}</p>
                                                        {item.type === 'invoice' && (
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor((item as any).status)}`}>
                                                                {(item as any).status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Invoices Tab */}
                        {activeTab === 'invoices' && (
                            <div className="space-y-4">
                                {invoices.length > 0 ? (
                                    invoices.map((invoice) => (
                                        <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {getStatusIcon(invoice.status)}
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Invoice #{invoice.invoice_number}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            Created: {new Date(invoice.created_at).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Due: {new Date(invoice.due_date).toLocaleDateString()}
                                                        </p>
                                                        {invoice.paid_date && (
                                                            <p className="text-sm text-gray-600">
                                                                Paid: {new Date(invoice.paid_date).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900">${invoice.amount.toLocaleString()}</p>
                                                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(invoice.status)}`}>
                                                        {invoice.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
                                        <p className="mt-1 text-sm text-gray-500">You don't have any invoices yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payments Tab */}
                        {activeTab === 'payments' && (
                            <div className="space-y-4">
                                {payments.length > 0 ? (
                                    payments.map((payment) => (
                                        <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-green-100 rounded-md">
                                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Payment via {payment.payment_method}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            Date: {new Date(payment.payment_date).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Transaction ID: {payment.transaction_id}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900">${payment.amount.toLocaleString()}</p>
                                                    <p className="text-sm text-gray-600">{payment.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                                        <p className="mt-1 text-sm text-gray-500">You haven't made any payments yet.</p>
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
