import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    source: string;
    status: string;
    notes: string;
    assigned_to: number | null;
    assigned_to_name?: string;
    created_at: string;
    updated_at: string;
    projects?: Project[];
    customer?: Customer;
}

interface Project {
    id: number;
    name: string;
    status: string;
    product: {
        id: number;
        name: string;
        price: number;
    };
}

interface Customer {
    id: number;
    name: string;
    services: {
        id: number;
        product: {
            id: number;
            name: string;
            price: number;
        };
        status: string;
        start_date: string;
    }[];
}

interface Props {
    lead: Lead;
}

const statusColors: { [key: string]: string } = {
    'new': 'bg-blue-100 text-blue-800',
    'contacted': 'bg-yellow-100 text-yellow-800',
    'qualified': 'bg-green-100 text-green-800',
    'proposal': 'bg-purple-100 text-purple-800',
    'negotiation': 'bg-orange-100 text-orange-800',
    'closed_won': 'bg-green-100 text-green-800',
    'closed_lost': 'bg-red-100 text-red-800',
};

const projectStatusColors: { [key: string]: string } = {
    'planning': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'pending_approval': 'bg-purple-100 text-purple-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'completed': 'bg-gray-100 text-gray-800',
};

export default function Show({ lead }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this lead?')) {
            router.delete(route('leads.destroy', lead.id));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Lead Details: {lead.name}
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('leads.edit', lead.id)}>
                            <Button>Edit Lead</Button>
                        </Link>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Link href={route('leads.index')}>
                            <Button variant="secondary">Back to Leads</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Lead: ${lead.name}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Lead Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Lead Information</h3>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[lead.status]}`}>
                                    {lead.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                                    <p className="text-sm text-gray-900">{lead.name}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                                    <p className="text-sm text-gray-900">
                                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800">
                                            {lead.email}
                                        </a>
                                    </p>
                                </div>

                                {lead.phone && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                                        <p className="text-sm text-gray-900">
                                            <a href={`tel:${lead.phone}`} className="text-blue-600 hover:text-blue-800">
                                                {lead.phone}
                                            </a>
                                        </p>
                                    </div>
                                )}

                                {lead.company && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
                                        <p className="text-sm text-gray-900">{lead.company}</p>
                                    </div>
                                )}

                                {lead.source && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Source</h4>
                                        <p className="text-sm text-gray-900">{lead.source}</p>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h4>
                                    <p className="text-sm text-gray-900">{lead.assigned_to_name || 'Unassigned'}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                                    <p className="text-sm text-gray-900">{formatDate(lead.created_at)}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
                                    <p className="text-sm text-gray-900">{formatDate(lead.updated_at)}</p>
                                </div>
                            </div>

                            {lead.address && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                                    <p className="text-sm text-gray-900 whitespace-pre-line">{lead.address}</p>
                                </div>
                            )}

                            {lead.notes && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                                    <p className="text-sm text-gray-900 whitespace-pre-line">{lead.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Projects */}
                    {lead.projects && lead.projects.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Projects</h3>
                                <div className="space-y-4">
                                    {lead.projects.map((project) => (
                                        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Product: {project.product.name} - ${project.product.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${projectStatusColors[project.status]}`}>
                                                    {project.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Customer Information */}
                    {lead.customer && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900">{lead.customer.name}</h4>
                                </div>

                                {lead.customer.services && lead.customer.services.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Active Services</h4>
                                        <div className="space-y-2">
                                            {lead.customer.services.map((service) => (
                                                <div key={service.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                                                    <div>
                                                        <span className="font-medium">{service.product.name}</span>
                                                        <span className="text-sm text-gray-600 ml-2">
                                                            Started: {formatDate(service.start_date)}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">${service.product.price.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-600">{service.status}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                {lead.status === 'qualified' && (
                                    <Link href={route('projects.create', { lead_id: lead.id })}>
                                        <Button>Create Project</Button>
                                    </Link>
                                )}
                                {lead.status === 'closed_won' && !lead.customer && (
                                    <Link href={route('customers.create', { lead_id: lead.id })}>
                                        <Button>Convert to Customer</Button>
                                    </Link>
                                )}
                                <Link href={`mailto:${lead.email}`}>
                                    <Button variant="secondary">Send Email</Button>
                                </Link>
                                {lead.phone && (
                                    <Link href={`tel:${lead.phone}`}>
                                        <Button variant="secondary">Call</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
