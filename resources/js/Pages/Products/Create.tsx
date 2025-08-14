import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';

export default function CreateProduct() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        type: 'internet',
        price: '',
        billing_cycle: 'monthly',
        speed_mbps: '',
        is_active: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'));
    };

    const typeOptions = [
        { value: 'internet', label: 'Internet' },
        { value: 'cable_tv', label: 'Cable TV' },
        { value: 'voip', label: 'VoIP' },
        { value: 'dedicated_line', label: 'Dedicated Line' }
    ];

    const billingCycleOptions = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Create New Product / Service
                </h2>
            }
        >
            <Head title="Create Product" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Product Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., Paket Home 50 Mbps"
                                        className="mt-1"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Product description..."
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Type */}
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Service Type <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        options={typeOptions}
                                        className="mt-1"
                                        required
                                    />
                                    {errors.type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Price */}
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Price (IDR) <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="350000"
                                            className="mt-1"
                                            min="0"
                                            step="1000"
                                            required
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                        )}
                                    </div>

                                    {/* Billing Cycle */}
                                    <div>
                                        <label htmlFor="billing_cycle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Billing Cycle <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            value={data.billing_cycle}
                                            onChange={(e) => setData('billing_cycle', e.target.value)}
                                            options={billingCycleOptions}
                                            className="mt-1"
                                            required
                                        />
                                        {errors.billing_cycle && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing_cycle}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Speed (for internet products) */}
                                {data.type === 'internet' && (
                                    <div>
                                        <label htmlFor="speed_mbps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Speed (Mbps)
                                        </label>
                                        <Input
                                            id="speed_mbps"
                                            type="number"
                                            value={data.speed_mbps}
                                            onChange={(e) => setData('speed_mbps', e.target.value)}
                                            placeholder="50"
                                            className="mt-1"
                                            min="1"
                                        />
                                        {errors.speed_mbps && (
                                            <p className="mt-1 text-sm text-red-600">{errors.speed_mbps}</p>
                                        )}
                                    </div>
                                )}

                                {/* Status */}
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked as any)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Active Product
                                        </span>
                                    </label>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Active products are available for selection in projects
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        variant="secondary"
                                        onClick={() => window.history.back()}
                                        type="button"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Product'}
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
