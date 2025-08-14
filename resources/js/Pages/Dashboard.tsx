import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Stats {
    leads: {
        total: number;
        new: number;
        qualified: number;
        closed_won: number;
    };
    projects: {
        total: number;
        pending: number;
        in_progress: number;
        waiting_approval: number;
    };
    customers: {
        total: number;
        active: number;
        suspended: number;
    };
    services: {
        total: number;
        active: number;
    };
}

interface Lead {
    id: number;
    name: string;
    email: string;
    status: string;
    created_at: string;
    assigned_to?: {
        name: string;
    };
}

interface Project {
    id: number;
    title: string;
    status: string;
    estimated_value?: number;
    lead: {
        name: string;
    };
    product: {
        name: string;
    };
    assigned_to: {
        name: string;
    };
}

interface Props {
    stats: Stats;
    recentLeads: Lead[];
    pendingProjects: Project[];
}

export default function Dashboard({ stats, recentLeads, pendingProjects }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    CRM Dashboard - PT. Smart
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Leads Stats */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">L</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Total Leads
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {stats.leads.total}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    New: {stats.leads.new} | Qualified: {stats.leads.qualified} | Won: {stats.leads.closed_won}
                                </div>
                            </div>
                        </div>

                        {/* Projects Stats */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">P</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Total Projects
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {stats.projects.total}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    Pending: {stats.projects.pending} | In Progress: {stats.projects.in_progress} | Waiting Approval: {stats.projects.waiting_approval}
                                </div>
                            </div>
                        </div>

                        {/* Customers Stats */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">C</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Total Customers
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {stats.customers.total}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    Active: {stats.customers.active} | Suspended: {stats.customers.suspended}
                                </div>
                            </div>
                        </div>

                        {/* Services Stats */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">S</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                Active Services
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {stats.services.active}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    Total: {stats.services.total}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Leads */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Recent Leads
                                </h3>
                                <div className="space-y-3">
                                    {recentLeads.map((lead) => (
                                        <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {lead.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {lead.email}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                    lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                                                    lead.status === 'closed_won' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {lead.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pending Projects */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Projects Waiting Approval
                                </h3>
                                <div className="space-y-3">
                                    {pendingProjects.map((project) => (
                                        <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {project.title}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {project.lead.name} - {project.product.name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {project.estimated_value && (
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Rp {new Intl.NumberFormat('id-ID').format(project.estimated_value)}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {project.assigned_to.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
