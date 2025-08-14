import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';

interface Customer {
    id: number;
    customer_code: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    billing_address: string;
    installation_address: string | null;
    status: string;
    registration_date: string;
    notes: string | null;
    lead_id: number | null;
}

interface Lead {
    id: number;
    name: string;
    email: string;
    company: string | null;
}

interface Props {
    customer: Customer;
    leads: Lead[];
}

export default function EditCustomer({ customer, leads }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        company: customer.company || '',
        billing_address: customer.billing_address,
        installation_address: customer.installation_address || '',
        status: customer.status,
        registration_date: customer.registration_date,
        lead_id: customer.lead_id?.toString() || '',
        notes: customer.notes || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('customers.update', customer.id));
    };

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'terminated', label: 'Terminated' }
    ];

    const leadOptions = [
        { value: '', label: 'No Lead Associated' },
        ...leads.map(lead => ({
            value: lead.id.toString(),
            label: `${lead.name} ${lead.company ? `(${lead.company})` : ''}`
        }))
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Edit Customer: {customer.name} ({customer.customer_code})
                </h2>
            }
        >
            <Head title={`Edit ${customer.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Customer Code (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Customer Code
                                    </label>
                                    <Input
                                        type="text"
                                        value={customer.customer_code}
                                        className="mt-1 bg-gray-100 dark:bg-gray-600"
                                        disabled
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Customer code cannot be changed
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Phone Number
                                        </label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="081234567890"
                                            className="mt-1"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Company Name
                                        </label>
                                        <Input
                                            id="company"
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            placeholder="PT. Example Company"
                                            className="mt-1"
                                        />
                                        {errors.company && (
                                            <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div>
                                    <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Billing Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="billing_address"
                                        value={data.billing_address}
                                        onChange={(e) => setData('billing_address', e.target.value)}
                                        placeholder="Complete billing address..."
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {errors.billing_address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.billing_address}</p>
                                    )}
                                </div>

                                {/* Installation Address */}
                                <div>
                                    <label htmlFor="installation_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Installation Address
                                    </label>
                                    <textarea
                                        id="installation_address"
                                        value={data.installation_address}
                                        onChange={(e) => setData('installation_address', e.target.value)}
                                        placeholder="Installation address (if different from billing)..."
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    {errors.installation_address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.installation_address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Status */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Customer Status <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            options={statusOptions}
                                            className="mt-1"
                                            required
                                        />
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>

                                    {/* Registration Date */}
                                    <div>
                                        <label htmlFor="registration_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Registration Date <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="registration_date"
                                            type="date"
                                            value={data.registration_date}
                                            onChange={(e) => setData('registration_date', e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                        {errors.registration_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.registration_date}</p>
                                        )}
                                    </div>

                                    {/* Lead Association */}
                                    <div>
                                        <label htmlFor="lead_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Original Lead
                                        </label>
                                        <Select
                                            value={data.lead_id}
                                            onChange={(e) => setData('lead_id', e.target.value)}
                                            options={leadOptions}
                                            className="mt-1"
                                        />
                                        {errors.lead_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.lead_id}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any additional notes about this customer..."
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                    )}
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
                                        {processing ? 'Updating...' : 'Update Customer'}
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

