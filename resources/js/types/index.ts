// Product related types
export interface Product {
    id: number;
    name: string;
    description?: string;
    type: string;
    price: number;
    billing_cycle: 'monthly' | 'yearly';
    speed_mbps?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductFormData {
    name: string;
    description?: string;
    type: string;
    price: number;
    billing_cycle: 'monthly' | 'yearly';
    speed_mbps?: number;
    is_active: boolean;
}

export interface ProductFilters {
    search?: string;
    type?: string;
    status?: string;
}

// Lead related types
export interface Lead {
    id: number;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
    source?: string;
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
    notes?: string;
    assigned_to?: number;
    assignedTo?: User;
    created_at: string;
    updated_at: string;
}

// User related types
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'sales';
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

// Project related types
export interface Project {
    id: number;
    title: string;
    description?: string;
    lead_id: number;
    product_id: number;
    assigned_to: number;
    status: 'pending' | 'in_progress' | 'waiting_approval' | 'approved' | 'rejected' | 'completed';
    estimated_value?: number;
    expected_start_date?: string;
    expected_completion_date?: string;
    notes?: string;
    approved_by?: number;
    approved_at?: string;
    lead?: Lead;
    product?: Product;
    assignedTo?: User;
    approvedBy?: User;
    created_at: string;
    updated_at: string;
}

// Customer related types
export interface Customer {
    id: number;
    customer_code: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    billing_address: string;
    installation_address?: string;
    status: 'active' | 'suspended' | 'terminated';
    registration_date: string;
    lead_id?: number;
    notes?: string;
    lead?: Lead;
    services?: CustomerService[];
    created_at: string;
    updated_at: string;
}

export interface CustomerService {
    id: number;
    customer_id: number;
    product_id: number;
    service_number: string;
    status: 'active' | 'suspended' | 'terminated';
    activation_date: string;
    expiry_date?: string;
    monthly_fee: number;
    installation_notes?: string;
    technical_notes?: string;
    customer?: Customer;
    product?: Product;
    created_at: string;
    updated_at: string;
}

// Common pagination type
export interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
}

// Form validation errors
export interface ValidationErrors {
    [key: string]: string[];
}

// Base page props for Inertia
export type PageProps<T = Record<string, unknown>> = {
    auth?: {
        user: User;
    };
    errors?: ValidationErrors;
    flash?: {
        message?: string;
        error?: string;
    };
} & T;

// API Response types
export interface ApiResponse<T = any> {
    data?: T;
    message?: string;
    errors?: ValidationErrors;
}

// Dashboard stats
export interface DashboardStats {
    leads: {
        total: number;
        new: number;
        qualified: number;
        closed_won: number;
    };
    projects: {
        total: number;
        pending: number;
        in_progress: number;
        waiting_approval: number;
    };
    customers: {
        total: number;
        active: number;
        suspended: number;
    };
    services: {
        total: number;
        active: number;
    };
}
