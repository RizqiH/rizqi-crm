import { Head, useForm } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        customer_code: '',
        email: ''
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customer-portal.authenticate'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Customer Portal Login" />

            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            PT. Smart Customer Portal
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Access your account and manage your services
                        </p>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="customer_code" className="block text-sm font-medium text-gray-700">
                                Customer Code
                            </label>
                            <Input
                                id="customer_code"
                                type="text"
                                value={data.customer_code}
                                onChange={(e) => setData('customer_code', e.target.value)}
                                error={errors.customer_code}
                                placeholder="Enter your customer code"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                placeholder="Enter your email address"
                                className="mt-1"
                            />
                        </div>

                        {(errors as any).credentials && (
                            <div className="text-red-600 text-sm">{(errors as any).credentials}</div>
                        )}
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2 px-4"
                        >
                            {processing ? 'Signing in...' : 'Sign in to Portal'}
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Need help? Contact support at{' '}
                            <a href="mailto:support@ptsmart.com" className="text-indigo-600 hover:text-indigo-500">
                                support@ptsmart.com
                            </a>
                        </p>
                    </div>

                    <div className="text-center border-t border-gray-200 pt-4">
                        <a
                            href="/"
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            ← Back to Main Website
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
