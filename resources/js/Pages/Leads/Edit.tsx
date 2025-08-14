import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';

interface User {
    id: number;
    name: string;
}

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
}

interface Props {
    lead: Lead;
    users: User[];
}

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' },
];

export default function Edit({ lead, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        address: lead.address || '',
        source: lead.source || '',
        status: lead.status,
        notes: lead.notes || '',
        assigned_to: lead.assigned_to?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('leads.update', lead.id));
    };

    const userOptions = [
        { value: '', label: 'Select Sales Person' },
        ...users.map(user => ({ value: user.id.toString(), label: user.name }))
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Lead: {lead.name}
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('leads.show', lead.id)}>
                            <Button variant="secondary">View Details</Button>
                        </Link>
                        <Link href={route('leads.index')}>
                            <Button variant="secondary">Back to Leads</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Lead: ${lead.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <Input
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            error={errors.name}
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            error={errors.email}
                                            required
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <Input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            error={errors.phone}
                                        />
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <Input
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            error={errors.company}
                                        />
                                    </div>

                                    {/* Source */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Source
                                        </label>
                                        <Input
                                            placeholder="e.g., Website, Referral, Cold Call"
                                            value={data.source}
                                            onChange={(e) => setData('source', e.target.value)}
                                            error={errors.source}
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status *
                                        </label>
                                        <Select
                                            options={statusOptions}
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            error={errors.status}
                                            required
                                        />
                                    </div>

                                    {/* Assigned To */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assigned To
                                        </label>
                                        <Select
                                            options={userOptions}
                                            value={data.assigned_to}
                                            onChange={(e) => setData('assigned_to', e.target.value)}
                                            error={errors.assigned_to}
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Full address"
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Additional notes about this lead"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-4 pt-6">
                                    <Link href={route('leads.index')}>
                                        <Button variant="secondary" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Lead'}
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
