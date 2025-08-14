import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Pagination from '@/Components/UI/Pagination';

interface User {
    id: number;
    name: string;
}

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    address: string | null;
    source: string | null;
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
    notes: string | null;
    assigned_to: number | null;
    assigned_to_name?: string;
    created_at: string;
    updated_at: string;
}

interface PaginatedLeads {
    data: Lead[];
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
}

interface Props {
    leads: PaginatedLeads;
    users: User[];
    filters: {
        search?: string;
        status?: string;
        assigned_to?: string;
    };
}

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' },
];

const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    proposal: 'bg-purple-100 text-purple-800',
    negotiation: 'bg-orange-100 text-orange-800',
    closed_won: 'bg-emerald-100 text-emerald-800',
    closed_lost: 'bg-red-100 text-red-800',
};

export default function Index({ leads, users, filters }: Props) {
    // Ensure leads data is properly structured with defaults
    const safeLeads = {
        data: leads?.data || [],
        meta: leads?.meta || {
            current_page: 1,
            from: 0,
            last_page: 1,
            per_page: 10,
            to: 0,
            total: 0
        },
        links: leads?.links || []
    };

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedUser, setSelectedUser] = useState(filters.assigned_to || '');

    const handleFilter = () => {
        router.get(route('leads.index'), {
            search: searchTerm,
            status: selectedStatus,
            assigned_to: selectedUser,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedUser('');
        router.get(route('leads.index'));
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            router.delete(route('leads.destroy', id));
        }
    };

    const userOptions = [
        { value: '', label: 'All Sales' },
        ...(users || []).map(user => ({ value: user.id.toString(), label: user.name }))
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Lead Management
                    </h2>
                    <Link href={route('leads.create')}>
                        <Button>Add New Lead</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Leads" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input
                                    placeholder="Search leads..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Select
                                    options={statusOptions}
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                />
                                <Select
                                    options={userOptions}
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleFilter} className="flex-1">
                                        Filter
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleClearFilters}
                                        className="flex-1"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Lead Info
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Assigned To
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {safeLeads.data.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {lead.name}
                                                        </div>
                                                        {lead.company && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {lead.company}
                                                            </div>
                                                        )}
                                                        {lead.source && (
                                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                                Source: {lead.source}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {lead.email}
                                                        </div>
                                                        {lead.phone && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {lead.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[lead.status]}`}>
                                                        {lead.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {lead.assigned_to_name || 'Unassigned'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                                                                            <Link
                                                            href={route('leads.show', lead.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route('leads.edit', lead.id)}
                                                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(lead.id)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            Delete
                                                        </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {safeLeads.data.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">No leads found.</p>
                                    <Link href={route('leads.create')} className="mt-4 inline-block">
                                        <Button>Create First Lead</Button>
                                    </Link>
                                </div>
                            )}

                            {/* Pagination */}
                            {safeLeads.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination
                                        links={safeLeads.links}
                                        meta={safeLeads.meta}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
