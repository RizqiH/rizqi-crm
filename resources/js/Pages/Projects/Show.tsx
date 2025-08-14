import { useState } from 'react';
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
    notes: string;
    created_at: string;
    updated_at: string;
    approved_at?: string;
    completed_at?: string;
    rejected_at?: string;
    rejection_reason?: string;
    lead: {
        id: number;
        name: string;
        email: string;
        company: string;
        phone: string;
    };
    product: {
        id: number;
        name: string;
        price: number;
        description: string;
    };
    manager: {
        id: number;
        name: string;
        email: string;
    } | null;
    customer?: {
        id: number;
        name: string;
    };
}

interface Props {
    project: Project;
}

const statusColors: { [key: string]: string } = {
    'pending': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    'in_progress': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    'waiting_approval': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    'approved': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    'rejected': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    'completed': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
};

export default function Show({ project }: Props) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(route('projects.destroy', project.id));
        }
    };

    const handleSubmitForApproval = () => {
        if (confirm('Submit this project for manager approval?')) {
            router.patch(route('projects.submit-approval', project.id));
        }
    };

    const handleApprove = () => {
        if (confirm('Approve this project?')) {
            router.patch(route('projects.approve', project.id));
        }
    };

    const handleReject = () => {
        router.patch(route('projects.reject', project.id), {
            reason: rejectReason
        });
        setShowRejectModal(false);
        setRejectReason('');
    };

    const handleComplete = () => {
        if (confirm('Mark this project as completed?')) {
            router.patch(route('projects.complete', project.id));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const canSubmitForApproval = project.status === 'pending' || project.status === 'in_progress';
    const canApprove = project.status === 'waiting_approval';
    const canComplete = project.status === 'approved';
    const canEdit = ['pending', 'in_progress', 'rejected'].includes(project.status);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Project: {project.name}
                    </h2>
                    <div className="flex gap-2">
                        {canEdit && (
                            <Link href={route('projects.edit', project.id)}>
                                <Button>Edit Project</Button>
                            </Link>
                        )}
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Link href={route('projects.index')}>
                            <Button variant="secondary">Back to Projects</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Project: ${project.name}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Project Information */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Project Information</h3>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[project.status]}`}>
                                    {project.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Project Name</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{project.name}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Estimated Value</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        {project.estimated_value ? formatCurrency(project.estimated_value) : 'Not specified'}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        {project.start_date ? formatDate(project.start_date) : 'Not set'}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        {project.end_date ? formatDate(project.end_date) : 'Not set'}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(project.created_at)}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(project.updated_at)}</p>
                                </div>

                                {project.approved_at && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Approved</h4>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(project.approved_at)}</p>
                                    </div>
                                )}

                                {project.completed_at && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Completed</h4>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(project.completed_at)}</p>
                                    </div>
                                )}

                                {project.manager && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Assigned Manager</h4>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{project.manager.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">{project.manager.email}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
                                <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">{project.description}</p>
                            </div>

                            {project.notes && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">{project.notes}</p>
                                </div>
                            )}

                            {project.rejection_reason && (
                                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Rejection Reason</h4>
                                    <p className="text-sm text-red-700 dark:text-red-300">{project.rejection_reason}</p>
                                    {project.rejected_at && (
                                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                            Rejected on {formatDate(project.rejected_at)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lead Information */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Lead Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Lead Name</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{project.lead.name}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Company</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{project.lead.company || 'Not specified'}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        <a href={`mailto:${project.lead.email}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                            {project.lead.email}
                                        </a>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        {project.lead.phone ? (
                                            <a href={`tel:${project.lead.phone}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                                {project.lead.phone}
                                            </a>
                                        ) : 'Not provided'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Link href={route('leads.show', project.lead.id)}>
                                    <Button variant="secondary" className="text-sm">View Lead Details</Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product/Service</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Product Name</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{project.product.name}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Price</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{formatCurrency(project.product.price)}</p>
                                </div>
                            </div>

                            {project.product.description && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{project.product.description}</p>
                                </div>
                            )}

                            <div className="mt-4">
                                <Link href={route('products.show', project.product.id)}>
                                    <Button variant="secondary" className="text-sm">View Product Details</Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Project Actions */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Project Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                {canSubmitForApproval && (
                                    <Button onClick={handleSubmitForApproval} className="bg-purple-600 hover:bg-purple-700">
                                        Submit for Approval
                                    </Button>
                                )}

                                {canApprove && (
                                    <>
                                        <Button onClick={handleApprove} variant="success">
                                            Approve Project
                                        </Button>
                                        <Button
                                            onClick={() => setShowRejectModal(true)}
                                            variant="danger"
                                        >
                                            Reject Project
                                        </Button>
                                    </>
                                )}

                                {canComplete && (
                                    <Button onClick={handleComplete} className="bg-gray-600 hover:bg-gray-700">
                                        Mark as Completed
                                    </Button>
                                )}

                                {project.status === 'approved' && (
                                    <Link href={route('customers.create', { project_id: project.id })}>
                                        <Button variant="secondary">Convert to Customer</Button>
                                    </Link>
                                )}

                                <Link href={`mailto:${project.lead.email}`}>
                                    <Button variant="secondary">Email Lead</Button>
                                </Link>

                                {project.lead.phone && (
                                    <Link href={`tel:${project.lead.phone}`}>
                                        <Button variant="secondary">Call Lead</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Reject Project</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Rejection Reason (Optional)
                            </label>
                            <textarea
                                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Explain why this project is being rejected..."
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowRejectModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleReject}>
                                Reject Project
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
