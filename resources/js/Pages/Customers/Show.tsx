import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/UI/Button';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface CustomerService {
    id: number;
    service_number: string;
    status: string;
    activation_date: string;
    expiry_date: string;
    monthly_fee: number;
    installation_notes: string;
    technical_notes: string;
    product: {
        id: number;
        name: string;
        price: number;
    };
}

interface Customer {
    id: number;
    customer_code: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    billing_address: string;
    installation_address: string;
    status: string;
    registration_date: string;
    notes: string;
    lead?: {
        id: number;
        name: string;
        company: string;
    };
    services: CustomerService[];
}

interface Props {
    customer: Customer;
    products: Product[];
}

export default function Show({ customer, products }: Props) {
    const [showAddService, setShowAddService] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [monthlyFee, setMonthlyFee] = useState('');
    const [activationDate, setActivationDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [installationNotes, setInstallationNotes] = useState('');

    const handleAddService = () => {
        if (!selectedProduct) return;

        router.post(route('customers.add-service', customer.id), {
            product_id: selectedProduct,
            monthly_fee: monthlyFee,
            activation_date: activationDate,
            expiry_date: expiryDate,
            installation_notes: installationNotes
        }, {
            onSuccess: () => {
                setShowAddService(false);
                setSelectedProduct('');
                setMonthlyFee('');
                setActivationDate('');
                setExpiryDate('');
                setInstallationNotes('');
            }
        });
    };

    const handleRemoveService = (serviceId: number) => {
        if (confirm('Are you sure you want to remove this service?')) {
            router.delete(route('customers.remove-service', [customer.id, serviceId]));
        }
    };

    const handleSuspendService = (serviceId: number) => {
        router.patch(route('customers.suspend-service', [customer.id, serviceId]));
    };

    const handleActivateService = (serviceId: number) => {
        router.patch(route('customers.activate-service', [customer.id, serviceId]));
    };

    const getStatusColor = (status: string) => {
        const colors = {
            'active': 'bg-green-100 text-green-800',
            'inactive': 'bg-gray-100 text-gray-800',
            'suspended': 'bg-red-100 text-red-800',
            'trial': 'bg-blue-100 text-blue-800'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

    const calculateTotalMonthlyRevenue = () => {
        return customer.services
            .filter(service => service.status === 'active')
            .reduce((total, service) => total + service.monthly_fee, 0);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Customer Details: {customer.name}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {customer.customer_code} • {customer.company}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('customers.edit', customer.id)}>
                            <Button variant="secondary">Edit Customer</Button>
                        </Link>
                        <Link href={route('customers.index')}>
                            <Button variant="secondary">Back to Customers</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Customer: ${customer.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Customer Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                                    {customer.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                        Contact Information
                                    </h4>
                                    <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                    <p className="text-sm text-gray-600">{customer.email}</p>
                                    {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
                                    {customer.company && <p className="text-sm text-gray-600">{customer.company}</p>}
                                </div>

                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                        Registration
                                    </h4>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(customer.registration_date)}
                                    </p>
                                    <p className="text-xs text-gray-500">Customer Code: {customer.customer_code}</p>
                                    {customer.lead && (
                                        <Link href={route('leads.show', customer.lead.id)} className="text-sm text-indigo-600 hover:text-indigo-900">
                                            View Original Lead →
                                        </Link>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                        Revenue Summary
                                    </h4>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(calculateTotalMonthlyRevenue())}/month
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        From {customer.services.filter(s => s.status === 'active').length} active services
                                    </p>
                                </div>
                            </div>

                            {/* Addresses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                        Billing Address
                                    </h4>
                                    <p className="text-sm text-gray-900 whitespace-pre-line">
                                        {customer.billing_address || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                        Installation Address
                                    </h4>
                                    <p className="text-sm text-gray-900 whitespace-pre-line">
                                        {customer.installation_address || 'Same as billing address'}
                                    </p>
                                </div>
                            </div>

                            {/* Notes */}
                            {customer.notes && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                        Notes
                                    </h4>
                                    <p className="text-sm text-gray-900 whitespace-pre-line">{customer.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Services Management */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Services ({customer.services.length})
                                </h3>
                                <Button onClick={() => setShowAddService(true)}>
                                    Add Service
                                </Button>
                            </div>

                            {/* Add Service Form */}
                            {showAddService && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Add New Service</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product/Service *
                                            </label>
                                            <select
                                                value={selectedProduct}
                                                onChange={(e) => {
                                                    setSelectedProduct(e.target.value);
                                                    const product = products.find(p => p.id.toString() === e.target.value);
                                                    if (product) {
                                                        setMonthlyFee(product.price.toString());
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select a product</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} - {formatCurrency(product.price)}/month
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Monthly Fee
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={monthlyFee}
                                                onChange={(e) => setMonthlyFee(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Activation Date
                                            </label>
                                            <input
                                                type="date"
                                                value={activationDate}
                                                onChange={(e) => setActivationDate(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="date"
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Installation Notes
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={installationNotes}
                                                onChange={(e) => setInstallationNotes(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Installation notes and requirements"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button onClick={handleAddService} disabled={!selectedProduct}>
                                            Add Service
                                        </Button>
                                        <Button variant="secondary" onClick={() => setShowAddService(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Services List */}
                            <div className="space-y-4">
                                {customer.services.length > 0 ? (
                                    customer.services.map((service) => (
                                        <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="text-md font-semibold text-gray-900">
                                                        {service.product.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">Service: {service.service_number}</p>
                                                </div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                                                    {service.status.toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">Monthly Fee</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(service.monthly_fee)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Active Period</p>
                                                    <p className="text-sm text-gray-900">
                                                        {formatDate(service.activation_date)} - {formatDate(service.expiry_date)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Base Price</p>
                                                    <p className="text-sm text-gray-900">
                                                        {formatCurrency(service.product.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            {(service.installation_notes || service.technical_notes) && (
                                                <div className="mb-3">
                                                    {service.installation_notes && (
                                                        <div className="mb-2">
                                                            <p className="text-xs text-gray-500">Installation Notes</p>
                                                            <p className="text-sm text-gray-900">{service.installation_notes}</p>
                                                        </div>
                                                    )}
                                                    {service.technical_notes && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Technical Notes</p>
                                                            <p className="text-sm text-gray-900">{service.technical_notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-3 border-t border-gray-200">
                                                {service.status === 'active' ? (
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleSuspendService(service.id)}
                                                        className="text-sm"
                                                    >
                                                        Suspend
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleActivateService(service.id)}
                                                        className="text-sm"
                                                    >
                                                        Activate
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleRemoveService(service.id)}
                                                    className="text-sm"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">No services assigned to this customer</p>
                                        <Button onClick={() => setShowAddService(true)}>
                                            Add First Service
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
