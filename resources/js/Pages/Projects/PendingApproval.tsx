import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';

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
        email: string;
    };
    product: {
        id: number;
        name: string;
        price: number;
    };
}

interface Props {
    projects: Project[];
}

export default function PendingApproval({ projects }: Props) {
    const handleApprove = (projectId: number) => {
        if (confirm('Approve this project?')) {
            router.patch(route('projects.approve', projectId));
        }
    };

    const handleReject = (projectId: number) => {
        const reason = prompt('Please provide a reason for rejection (optional):');
        if (reason !== null) { // User didn't cancel
            router.patch(route('projects.reject', projectId), {
                reason: reason
            });
        }
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
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Projects Pending Approval
                    </h2>
                    <Link href={route('projects.index')}>
                        <Button variant="secondary">Back to Projects</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Pending Approval" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {projects.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                                        No projects pending approval
                                    </div>
                                    <p className="text-gray-400 dark:text-gray-500">
                                        All projects have been reviewed or none have been submitted for approval yet.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {projects.length} project{projects.length > 1 ? 's' : ''} awaiting your approval
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Review the details below and approve or reject each project.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        {projects.map((project) => (
                                            <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            {project.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            Submitted on {formatDate(project.created_at)}
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                                                        PENDING APPROVAL
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                            Lead Information
                                                        </h5>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {project.lead.name}
                                                        </p>
                                                        {project.lead.company && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {project.lead.company}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                                            {project.lead.email}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                            Product/Service
                                                        </h5>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {project.product.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {formatCurrency(project.product.price)}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                            Project Value
                                                        </h5>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {project.estimated_value
                                                                ? formatCurrency(project.estimated_value)
                                                                : 'Not specified'
                                                            }
                                                        </p>
                                                        {project.start_date && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                                Start: {formatDate(project.start_date)}
                                                            </p>
                                                        )}
                                                        {project.end_date && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                                End: {formatDate(project.end_date)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                        Description
                                                    </h5>
                                                    <p className="text-sm text-gray-900 dark:text-gray-100 max-h-20 overflow-y-auto">
                                                        {project.description}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <div className="flex gap-2 mb-2 sm:mb-0">
                                                        <Link href={route('projects.show', project.id)}>
                                                            <Button variant="secondary" className="text-sm">
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('leads.show', project.lead.id)}>
                                                            <Button variant="secondary" className="text-sm">
                                                                View Lead
                                                            </Button>
                                                        </Link>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleReject(project.id)}
                                                            className="text-sm"
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            variant="success"
                                                            onClick={() => handleApprove(project.id)}
                                                            className="text-sm"
                                                        >
                                                            Approve
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
