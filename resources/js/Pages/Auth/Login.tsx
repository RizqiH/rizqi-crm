import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillCredentials = (email: string) => {
        setData('email', email);
        setData('password', 'password');
    };

    return (
        <GuestLayout>
            <Head title="PT. Smart CRM - Login" />

            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    PT. Smart CRM
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Customer Relationship Management System
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Internet Service Provider Management Platform
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {/* Development Credentials Panel */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3">
                    🔑 Kredensial Default (Development)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-2">
                        <div
                            className="p-2 bg-white dark:bg-gray-800 rounded border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => fillCredentials('admin@smart.com')}
                        >
                            <div className="font-medium text-gray-700 dark:text-gray-300">Admin</div>
                            <div className="text-gray-600 dark:text-gray-400">admin@smart.com</div>
                            <div className="text-gray-500 dark:text-gray-500">password</div>
                        </div>
                        <div
                            className="p-2 bg-white dark:bg-gray-800 rounded border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => fillCredentials('manager@smart.com')}
                        >
                            <div className="font-medium text-gray-700 dark:text-gray-300">Manager</div>
                            <div className="text-gray-600 dark:text-gray-400">manager@smart.com</div>
                            <div className="text-gray-500 dark:text-gray-500">password</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div
                            className="p-2 bg-white dark:bg-gray-800 rounded border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => fillCredentials('sales1@smart.com')}
                        >
                            <div className="font-medium text-gray-700 dark:text-gray-300">Sales 1</div>
                            <div className="text-gray-600 dark:text-gray-400">sales1@smart.com</div>
                            <div className="text-gray-500 dark:text-gray-500">password</div>
                        </div>
                        <div
                            className="p-2 bg-white dark:bg-gray-800 rounded border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => fillCredentials('sales2@smart.com')}
                        >
                            <div className="font-medium text-gray-700 dark:text-gray-300">Sales 2</div>
                            <div className="text-gray-600 dark:text-gray-400">sales2@smart.com</div>
                            <div className="text-gray-500 dark:text-gray-500">password</div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                    💡 Klik email mana pun untuk mengisi otomatis form login
                </div>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? 'Logging in...' : 'Log in'}
                    </PrimaryButton>
                </div>
            </form>



            {/* Customer Portal Link */}
            <div className="mt-4 text-center">
                <Link
                    href={route('customer-portal.login')}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                >
                    Customer Portal Login →
                </Link>
            </div>
        </GuestLayout>
    );
}
