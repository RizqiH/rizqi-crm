import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, FormEventHandler } from 'react';

interface SupportTicket {
    id: number;
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    created_at: string;
    updated_at: string;
}

interface SupportProps extends PageProps {
    customer: {
        id: number;
        name: string;
        customer_code: string;
        email: string;
    };
    tickets: SupportTicket[];
}

export default function Support({ customer, tickets }: SupportProps) {
    const [activeTab, setActiveTab] = useState<'create' | 'tickets'>('create');
    const [filter, setFilter] = useState<string>('all');

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
        description: '',
        category: 'general' as 'technical' | 'billing' | 'service' | 'general',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/customer-portal/support', {
            onSuccess: () => {
                reset();
                setActiveTab('tickets');
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'resolved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'closed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'in_progress':
                return (
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'resolved':
                return (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'closed':
                return (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        if (filter === 'all') return true;
        return ticket.status.toLowerCase() === filter;
    });

    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Customer Support" />

            {/* Header */}
            <div className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
                            <p className="text-gray-600">Get help with your services and account</p>
                        </div>
                        <div className="flex space-x-4">
                            <a
                                href="/customer-portal/dashboard"
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                                Back to Dashboard
                            </a>
                            <button
                                onClick={() => setActiveTab('create')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Create New Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Support Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-md">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                                <p className="text-2xl font-semibold text-gray-900">{openTickets}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-md">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-2xl font-semibold text-gray-900">{inProgressTickets}</p>
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
                                <p className="text-sm font-medium text-gray-600">Resolved</p>
                                <p className="text-2xl font-semibold text-gray-900">{resolvedTickets}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-md">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Closed</p>
                                <p className="text-2xl font-semibold text-gray-900">{closedTickets}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                                    activeTab === 'create'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Create Ticket
                            </button>
                            <button
                                onClick={() => setActiveTab('tickets')}
                                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                                    activeTab === 'tickets'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                My Tickets ({tickets.length})
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Create Ticket Tab */}
                        {activeTab === 'create' && (
                            <div className="max-w-2xl">
                                <h3 className="text-lg font-medium text-gray-900 mb-6">Create Support Ticket</h3>

                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="subject"
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Brief description of your issue"
                                            required
                                        />
                                        {errors.subject && <p className="mt-2 text-sm text-red-600">{errors.subject}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="category"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value as any)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="general">General</option>
                                                <option value="technical">Technical Support</option>
                                                <option value="billing">Billing & Payments</option>
                                                <option value="service">Service Issues</option>
                                            </select>
                                            {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                                Priority <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="priority"
                                                value={data.priority}
                                                onChange={(e) => setData('priority', e.target.value as any)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                            {errors.priority && <p className="mt-2 text-sm text-red-600">{errors.priority}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={6}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Please provide detailed information about your issue..."
                                            required
                                        />
                                        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-blue-800">Tips for faster resolution</h3>
                                                <div className="mt-2 text-sm text-blue-700">
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>Include specific error messages if any</li>
                                                        <li>Mention your service number if applicable</li>
                                                        <li>Describe steps to reproduce the issue</li>
                                                        <li>Include screenshots for technical issues</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {processing ? 'Creating...' : 'Create Ticket'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Tickets Tab */}
                        {activeTab === 'tickets' && (
                            <div>
                                {/* Filter Buttons */}
                                <div className="flex space-x-4 mb-6">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                            filter === 'all'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        All Tickets
                                    </button>
                                    <button
                                        onClick={() => setFilter('open')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                            filter === 'open'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Open
                                    </button>
                                    <button
                                        onClick={() => setFilter('in_progress')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                            filter === 'in_progress'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        In Progress
                                    </button>
                                    <button
                                        onClick={() => setFilter('resolved')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                            filter === 'resolved'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Resolved
                                    </button>
                                    <button
                                        onClick={() => setFilter('closed')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                            filter === 'closed'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Closed
                                    </button>
                                </div>

                                {/* Tickets List */}
                                <div className="space-y-4">
                                    {filteredTickets.length > 0 ? (
                                        filteredTickets.map((ticket) => (
                                            <div key={ticket.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3">
                                                        {getStatusIcon(ticket.status)}
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-medium text-gray-900">{ticket.subject}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                                                            <div className="flex items-center space-x-4 mt-3">
                                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                                                                    {ticket.status.replace('_', ' ').toUpperCase()}
                                                                </span>
                                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                                                                    {ticket.priority.toUpperCase()} PRIORITY
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    Created: {new Date(ticket.created_at).toLocaleDateString()}
                                                                </span>
                                                                {ticket.updated_at !== ticket.created_at && (
                                                                    <span className="text-xs text-gray-500">
                                                                        Updated: {new Date(ticket.updated_at).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">Ticket #{ticket.id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {filter === 'all' ? "You haven't created any support tickets yet." : `No ${filter.replace('_', ' ')} tickets found.`}
                                            </p>
                                            {filter === 'all' && (
                                                <div className="mt-6">
                                                    <button
                                                        onClick={() => setActiveTab('create')}
                                                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                                                    >
                                                        Create Your First Ticket
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">How do I reset my password?</h4>
                                <p className="text-sm text-gray-600 mb-4">Contact our support team with your customer ID to request a password reset.</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">How can I view my service details?</h4>
                                <p className="text-sm text-gray-600 mb-4">Go to the Services page in your customer portal to view all your active services.</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">When will my next bill be due?</h4>
                                <p className="text-sm text-gray-600 mb-4">Check the Billing page for your next due date and outstanding balance information.</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">How do I report a service outage?</h4>
                                <p className="text-sm text-gray-600 mb-4">Create a support ticket with priority set to "High" or "Urgent" for service outages.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
