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

interface Props {
    leads: Lead[];
    products: Product[];
    managers: User[];
    selectedLead?: Lead | null;
}

// Status removed - automatically set to 'pending' by system

export default function Create({ leads, products, managers, selectedLead }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        lead_id: selectedLead?.id.toString() || '',
        product_id: '',
        manager_id: '',
        estimated_value: '',
        start_date: '',
        end_date: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    const leadOptions = [
        { value: '', label: 'Select Lead' },
        ...leads.map(lead => ({
            value: lead.id.toString(),
            label: `${lead.name}${lead.company ? ` (${lead.company})` : ''}`
        }))
    ];

    const productOptions = [
        { value: '', label: 'Select Product/Service' },
        ...products.map(product => ({
            value: product.id.toString(),
            label: `${product.name} - $${product.price.toLocaleString()}`
        }))
    ];

    const managerOptions = [
        { value: '', label: 'Select Manager (Optional)' },
        ...managers.map(manager => ({ value: manager.id.toString(), label: manager.name }))
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create New Project
                    </h2>
                    <Link href={route('projects.index')}>
                        <Button variant="secondary">Back to Projects</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Create Project" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {selectedLead && (
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                        Creating project for selected lead:
                                    </h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">
                                        {selectedLead.name}
                                        {selectedLead.company && ` (${selectedLead.company})`}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Project Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Project Name *
                                        </label>
                                        <Input
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            error={errors.name}
                                            placeholder="Enter project name"
                                            required
                                        />
                                    </div>

                                    {/* Project Status Info */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Project Status
                                        </label>
                                        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-400">
                                            Will be set to "Pending" automatically
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Status is managed by the system workflow
                                        </p>
                                    </div>

                                    {/* Lead */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Lead *
                                        </label>
                                        <Select
                                            options={leadOptions}
                                            value={data.lead_id}
                                            onChange={(e) => setData('lead_id', e.target.value)}
                                            error={errors.lead_id}
                                            required
                                        />
                                    </div>

                                    {/* Product */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Product/Service *
                                        </label>
                                        <Select
                                            options={productOptions}
                                            value={data.product_id}
                                            onChange={(e) => setData('product_id', e.target.value)}
                                            error={errors.product_id}
                                            required
                                        />
                                    </div>

                                    {/* Estimated Value */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Estimated Value
                                        </label>
                                        <Input
                                            type="number"
                                            value={data.estimated_value}
                                            onChange={(e) => setData('estimated_value', e.target.value)}
                                            error={errors.estimated_value}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Manager */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Assigned Manager
                                        </label>
                                        <Select
                                            options={managerOptions}
                                            value={data.manager_id}
                                            onChange={(e) => setData('manager_id', e.target.value)}
                                            error={errors.manager_id}
                                        />
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                        />
                                        {errors.start_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                                        )}
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                        />
                                        {errors.end_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Project Description *
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe the project scope, deliverables, and requirements"
                                        required
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any additional notes or special requirements"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                    )}
                                </div>

                                {/* Workflow Information */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                        📋 Project Workflow
                                    </h3>
                                    <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                        <p><strong>1. Pending:</strong> Project will be created with "Pending" status</p>
                                        <p><strong>2. Submit for Approval:</strong> You can submit project to manager for approval</p>
                                        <p><strong>3. Manager Review:</strong> Only managers can approve or reject projects</p>
                                        <p><strong>4. Implementation:</strong> Approved projects can proceed to completion</p>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-4 pt-6">
                                    <Link href={route('projects.index')}>
                                        <Button variant="secondary" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Project'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
