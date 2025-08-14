import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';

interface Lead {
    id: number;
    name: string;
    company: string;
    email: string;
}

interface Props {
    leads: Lead[];
    selectedLead?: Lead;
}

export default function Create({ leads, selectedLead }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: selectedLead?.name || '',
        email: selectedLead?.email || '',
        phone: '',
        company: selectedLead?.company || '',
        billing_address: '',
        installation_address: '',
        status: 'active',
        lead_id: selectedLead?.id || '',
        notes: ''
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customers.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create New Customer
                    </h2>
                    <Link href={route('customers.index')}>
                        <Button variant="secondary">Back to Customers</Button>
                    </Link>
                </div>
            }
        >
            <Head title="Create Customer" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {selectedLead && (
                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                                        Converting Lead to Customer
                                    </h3>
                                    <p className="text-sm text-blue-700">
                                        Pre-filling customer data from lead: <strong>{selectedLead.name}</strong>
                                        {selectedLead.company && ` (${selectedLead.company})`}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Customer Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Customer Name *
                                        </label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            error={errors.name}
                                            placeholder="Enter customer name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            error={errors.email}
                                            placeholder="customer@company.com"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <Input
                                            id="phone"
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            error={errors.phone}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <Input
                                            id="company"
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            error={errors.company}
                                            placeholder="Company name"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="trial">Trial</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>

                                    {/* Lead Association */}
                                    <div>
                                        <label htmlFor="lead_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Associated Lead
                                        </label>
                                        <select
                                            id="lead_id"
                                            value={data.lead_id}
                                            onChange={(e) => setData('lead_id', parseInt(e.target.value) || '')}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">No associated lead</option>
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

                                    {/* Billing Address */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-2">
                                            Billing Address
                                        </label>
                                        <textarea
                                            id="billing_address"
                                            rows={3}
                                            value={data.billing_address}
                                            onChange={(e) => setData('billing_address', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter billing address"
                                        />
                                        {errors.billing_address && (
                                            <p className="mt-1 text-sm text-red-600">{errors.billing_address}</p>
                                        )}
                                    </div>

                                    {/* Installation Address */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="installation_address" className="block text-sm font-medium text-gray-700 mb-2">
                                            Installation Address
                                        </label>
                                        <textarea
                                            id="installation_address"
                                            rows={3}
                                            value={data.installation_address}
                                            onChange={(e) => setData('installation_address', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter installation address (if different from billing)"
                                        />
                                        {errors.installation_address && (
                                            <p className="mt-1 text-sm text-red-600">{errors.installation_address}</p>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes
                                        </label>
                                        <textarea
                                            id="notes"
                                            rows={4}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Additional notes about the customer"
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6 border-t border-gray-200">
                                    <Link href={route('customers.index')}>
                                        <Button variant="secondary">Cancel</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Customer'}
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
