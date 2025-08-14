import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Pagination from '@/Components/UI/Pagination';

interface Lead {
    id: number;
    name: string;
    company: string;
}

interface Product {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    estimated_value: number;
    start_date: string;
    end_date: string;
    created_at: string;
    lead: {
        id: number;
        name: string;
        company: string;
    };
    product: {
        id: number;
        name: string;
        price: number;
    };
    manager: {
        id: number;
        name: string;
    } | null;
}

interface PaginatedProjects {
    data: Project[];
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
    projects: PaginatedProjects;
    leads: Lead[];
    products: Product[];
    managers: User[];
    filters: {
        search?: string;
        status?: string;
        lead_id?: number;
        product_id?: number;
        manager_id?: number;
        date_from?: string;
        date_to?: string;
    };
}

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'waiting_approval', label: 'Waiting Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'completed', label: 'Completed' },
];

const statusColors: { [key: string]: string } = {
    'pending': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'waiting_approval': 'bg-purple-100 text-purple-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'completed': 'bg-gray-100 text-gray-800',
};

export default function Index({ projects, leads, products, managers, filters }: Props) {
    // Ensure projects data is properly structured with defaults
    const safeProjects = {
        data: projects?.data || [],
        meta: projects?.meta || {
            current_page: 1,
            from: 0,
            last_page: 1,
            per_page: 10,
            to: 0,
            total: 0
        },
        links: projects?.links || []
    };

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedLead, setSelectedLead] = useState(filters.lead_id?.toString() || '');
    const [selectedProduct, setSelectedProduct] = useState(filters.product_id?.toString() || '');
    const [selectedManager, setSelectedManager] = useState(filters.manager_id?.toString() || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = () => {
        const filterData: any = {};
        if (searchTerm) filterData.search = searchTerm;
        if (selectedStatus) filterData.status = selectedStatus;
        if (selectedLead) filterData.lead_id = selectedLead;
        if (selectedProduct) filterData.product_id = selectedProduct;
        if (selectedManager) filterData.manager_id = selectedManager;
        if (dateFrom) filterData.date_from = dateFrom;
        if (dateTo) filterData.date_to = dateTo;

        router.get(route('projects.index'), filterData);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedLead('');
        setSelectedProduct('');
        setSelectedManager('');
        setDateFrom('');
        setDateTo('');
        router.get(route('projects.index'));
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(route('projects.destroy', id));
        }
    };

    const leadOptions = [
        { value: '', label: 'All Leads' },
        ...(leads || []).map(lead => ({
            value: lead.id.toString(),
            label: `${lead.name}${lead.company ? ` (${lead.company})` : ''}`
        }))
    ];

    const productOptions = [
        { value: '', label: 'All Products' },
        ...(products || []).map(product => ({ value: product.id.toString(), label: product.name }))
    ];

    const managerOptions = [
        { value: '', label: 'All Managers' },
        ...(managers || []).map(manager => ({ value: manager.id.toString(), label: manager.name }))
    ];

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
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Projects Management
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('projects.pending-approval')}>
                            <Button variant="secondary">Pending Approval</Button>
                        </Link>
                        <Link href={route('projects.create')}>
                            <Button>Create Project</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <div className="mb-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <Input
                                        placeholder="Search projects..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Select
                                        options={statusOptions}
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    />
                                    <Select
                                        options={leadOptions}
                                        value={selectedLead}
                                        onChange={(e) => setSelectedLead(e.target.value)}
                                    />
                                    <Select
                                        options={productOptions}
                                        value={selectedProduct}
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                    />
                                    <Select
                                        options={managerOptions}
                                        value={selectedManager}
                                        onChange={(e) => setSelectedManager(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Date From
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Date To
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button onClick={handleFilter} className="w-full">
                                            Filter
                                        </Button>
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            variant="secondary"
                                            onClick={handleClearFilters}
                                            className="w-full"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Results Summary */}
                            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                Showing {safeProjects.data.length} of {safeProjects.meta.total} projects
                            </div>

                            {/* Table - Mobile Card View and Desktop Table */}
                            <div className="space-y-4">
                                {/* Mobile Card View */}
                                <div className="block lg:hidden space-y-4">
                                    {safeProjects.data.map((project) => (
                                        <div key={project.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                        {project.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                                                        {project.description}
                                                    </p>
                                                </div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${statusColors[project.status]}`}>
                                                    {project.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Lead:</span>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">{project.lead.name}</div>
                                                    {project.lead.company && (
                                                        <div className="text-gray-500 dark:text-gray-400">{project.lead.company}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Product:</span>
                                                    <div className="text-blue-600 dark:text-blue-400">{project.product.name}</div>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Value:</span>
                                                    {project.estimated_value && (
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                                            {formatCurrency(project.estimated_value)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Manager:</span>
                                                    <div className="text-gray-900 dark:text-gray-100">{project.manager?.name || 'Unassigned'}</div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    Created: {formatDate(project.created_at)}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('projects.show', project.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-medium"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('projects.edit', project.id)}
                                                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 text-xs font-medium"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                                                    Project Details
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/5">
                                                    Lead & Product
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/8">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/5">
                                                    Value & Dates
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/8">
                                                    Manager
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {safeProjects.data.map((project) => (
                                                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-4 py-4">
                                                        <div className="max-w-xs">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                {project.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                                {project.description}
                                                            </div>
                                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                                {formatDate(project.created_at)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="max-w-xs">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                {project.lead.name}
                                                            </div>
                                                            {project.lead.company && (
                                                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                                    {project.lead.company}
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-blue-600 dark:text-blue-400 truncate">
                                                                {project.product.name}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status]}`}>
                                                            {project.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="max-w-xs">
                                                            {project.estimated_value && (
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {formatCurrency(project.estimated_value)}
                                                                </div>
                                                            )}
                                                            {project.start_date && (
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Start: {formatDate(project.start_date)}
                                                                </div>
                                                            )}
                                                            {project.end_date && (
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    End: {formatDate(project.end_date)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                        <div className="truncate max-w-xs">
                                                            {project.manager?.name || 'Unassigned'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium">
                                                        <div className="flex flex-col space-y-1">
                                                            <Link
                                                                href={route('projects.show', project.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={route('projects.edit', project.id)}
                                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(project.id)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-left"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Empty State */}
                            {safeProjects.data.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">No projects found</div>
                                    <Link href={route('projects.create')}>
                                        <Button>Create Your First Project</Button>
                                    </Link>
                                </div>
                            )}

                            {/* Pagination */}
                            {safeProjects.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination
                                        links={safeProjects.links}
                                        meta={safeProjects.meta}
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
