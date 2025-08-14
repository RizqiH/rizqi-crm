import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';

interface Lead {
    id: number;
    name: string;
    company: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
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
    lead_id: number;
    product_id: number;
    manager_id: number;
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

interface Props {
    project: Project;
    leads: Lead[];
    products: Product[];
    managers: User[];
}

interface FormData {
    name: string;
    description: string;
    estimated_value: number | string;
    start_date: string;
    end_date: string;
    lead_id: number | string;
    product_id: number | string;
    manager_id: number | string;
}

export default function Edit({ project, leads, products, managers }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: project.name,
        description: project.description,
        estimated_value: project.estimated_value,
        start_date: project.start_date,
        end_date: project.end_date,
        lead_id: project.lead_id,
        product_id: project.product_id,
        manager_id: project.manager_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('projects.update', project.id));
    };

    const canEdit = () => {
        return ['pending', 'rejected'].includes(project.status);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Project: {project.name}
                    </h2>
                    <Link href={route('projects.show', project.id)}>
                        <Button variant="secondary">Back to Project</Button>
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Project: ${project.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {!canEdit() && (
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                Editing Restricted
                                            </h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>
                                                    Projects with status "{project.status}" cannot be edited.
                                                    Only projects in "pending" or "rejected" status can be modified.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Project Name */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Name *
                                        </label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            error={errors.name}
                                            placeholder="Enter project name"
                                            disabled={!canEdit()}
                                        />
                                    </div>

                                    {/* Lead Selection */}
                                    <div>
                                        <label htmlFor="lead_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Lead *
                                        </label>
                                        <select
                                            id="lead_id"
                                            value={data.lead_id}
                                            onChange={(e) => setData('lead_id', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            disabled={!canEdit()}
                                        >
                                            <option value="">Select a lead</option>
                                            {leads.map((lead) => (
                                                <option key={lead.id} value={lead.id}>
                                                    {lead.name} {lead.company ? `(${lead.company})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.lead_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.lead_id}</p>
                                        )}
                                    </div>

                                    {/* Product Selection */}
                                    <div>
                                        <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Product/Service *
                                        </label>
                                        <select
                                            id="product_id"
                                            value={data.product_id}
                                            onChange={(e) => setData('product_id', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            disabled={!canEdit()}
                                        >
                                            <option value="">Select a product/service</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} - ${product.price.toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.product_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.product_id}</p>
                                        )}
                                    </div>

                                    {/* Manager Selection */}
                                    <div>
                                        <label htmlFor="manager_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Manager
                                        </label>
                                        <select
                                            id="manager_id"
                                            value={data.manager_id}
                                            onChange={(e) => setData('manager_id', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            disabled={!canEdit()}
                                        >
                                            <option value="">Select a manager</option>
                                            {managers.map((manager) => (
                                                <option key={manager.id} value={manager.id}>
                                                    {manager.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.manager_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.manager_id}</p>
                                        )}
                                    </div>

                                    {/* Estimated Value */}
                                    <div>
                                        <label htmlFor="estimated_value" className="block text-sm font-medium text-gray-700 mb-2">
                                            Estimated Value ($)
                                        </label>
                                        <input
                                            id="estimated_value"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.estimated_value}
                                            onChange={(e) => setData('estimated_value', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="0.00"
                                            disabled={!canEdit()}
                                        />
                                        {errors.estimated_value && (
                                            <p className="mt-1 text-sm text-red-600">{errors.estimated_value}</p>
                                        )}
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date ? formatDate(data.start_date) : ''}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            disabled={!canEdit()}
                                        />
                                        {errors.start_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                                        )}
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date ? formatDate(data.end_date) : ''}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            disabled={!canEdit()}
                                        />
                                        {errors.end_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Describe the project requirements, scope, and objectives"
                                            disabled={!canEdit()}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Current Status Display */}
                                <div className="pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Current Status</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                This project is currently in "{project.status}" status.
                                            </p>
                                        </div>
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                            project.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                            project.status === 'waiting_approval' ? 'bg-purple-100 text-purple-800' :
                                            project.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            project.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                            project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {project.status.toUpperCase().replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                                    <div className="flex gap-2">
                                        <Link href={route('projects.show', project.id)}>
                                            <Button variant="secondary">Cancel</Button>
                                        </Link>
                                        {canEdit() && (
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex gap-2 ml-auto">
                                        <Link href={route('projects.index')}>
                                            <Button variant="secondary">Back to Projects</Button>
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
