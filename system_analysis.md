# PT. Smart CRM - System Analysis & Design Documentation

## 1. Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    USERS    │         │   PRODUCTS  │         │    LEADS    │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)              │ id (PK)     │         │ id (PK)     │
│ name        │         │ name        │         │ name        │
│ email       │         │ description │         │ email       │
│ password    │         │ type        │         │ phone       │
│ role        │         │ price       │         │ company     │
│ ...         │         │ billing_c.. │         │ address     │
└─────────────┘         │ speed_mbps  │         │ source      │
       │                │ is_active   │         │ status      │
       │                └─────────────┘         │ notes       │
       │                       │                │ assigned_to │
       │                       │                └─────────────┘
       │                       │                       │
       │                       │                       │
       │               ┌───────┴───────┐               │
       │               │               │               │
       │               ▼               ▼               ▼
       │        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
       │        │  PROJECTS   │ │  CUSTOMERS  │ │             │
       │        ├─────────────┤ ├─────────────┤ │             │
       │        │ id (PK)     │ │ id (PK)     │ │             │
       │        │ title       │ │ customer_c. │ │             │
       │        │ lead_id(FK) │ │ name        │ │             │
       │        │ product_id  │ │ email       │ │             │
       └────────┤ assigned_to │ │ phone       │ │             │
                │ approved_by │ │ company     │ │             │
                │ status      │ │ billing_a.. │ │             │
                │ est_value   │ │ install_a.. │ │             │
                │ ...         │ │ status      │ │             │
                └─────────────┘ │ lead_id(FK) │ │             │
                       │        └─────────────┘ │             │
                       │               │        │             │
                       │               │        │             │
                       │               ▼        │             │
                       │        ┌─────────────┐ │             │
                       │        │CUSTOMER_SERV│ │             │
                       │        ├─────────────┤ │             │
                       │        │ id (PK)     │ │             │
                       │        │customer_id  │ │             │
                       └────────┤product_id   │ │             │
                                │service_num. │ │             │
                                │ status      │ │             │
                                │activation_d.│ │             │
                                │monthly_fee  │ │             │
                                │ ...         │ │             │
                                └─────────────┘ │             │
```

## 2. Business Process Flow

### 2.1 Lead to Customer Conversion Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    LEAD     │    │   PROJECT   │    │  APPROVAL   │    │  CUSTOMER   │
│             │    │             │    │             │    │             │
│ Sales input │───▶│ Create      │───▶│ Manager     │───▶│ Auto create │
│ lead data   │    │ project     │    │ review      │    │ customer +  │
│             │    │ with        │    │             │    │ service     │
│ - Name      │    │ product     │    │ Approve/    │    │             │
│ - Company   │    │ assignment  │    │ Reject      │    │ Generate    │
│ - Contact   │    │             │    │             │    │ customer    │
│ - Notes     │    │ Estimate    │    │ Send email  │    │ code        │
└─────────────┘    │ value       │    │ notification│    └─────────────┘
                   └─────────────┘    └─────────────┘
```

### 2.2 Customer Service Management Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CUSTOMER  │    │   SERVICE   │    │   BILLING   │    │   SUPPORT   │
│             │    │             │    │             │    │             │
│ View        │───▶│ Add/Remove  │───▶│ Generate    │───▶│ Ticket      │
│ dashboard   │    │ services    │    │ billing     │    │ system      │
│             │    │             │    │             │    │             │
│ - Services  │    │ Suspend/    │    │ Payment     │    │ FAQ &       │
│ - Billing   │    │ Activate    │    │ tracking    │    │ Help        │
│ - Support   │    │             │    │             │    │             │
└─────────────┘    │ Technical   │    │ Invoice     │    │ Email       │
                   │ notes       │    │ history     │    │ notifications│
                   └─────────────┘    └─────────────┘    └─────────────┘
```

### 2.3 Role-Based Access Flow

```
┌─────────────┐
│    LOGIN    │
│             │
│ Email +     │
│ Password    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ ROLE CHECK  │
├─────────────┤
│ Admin       │──┐
│ Manager     │──┤
│ Sales       │──┤──┐
│ Support     │──┘  │
└─────────────┘     │
                    ▼
            ┌─────────────┐
            │ DASHBOARD   │
            │ FEATURES    │
            ├─────────────┤
            │ Admin:      │
            │ - All access│
            │             │
            │ Manager:    │
            │ - Reports   │
            │ - Approvals │
            │             │
            │ Sales:      │
            │ - Leads     │
            │ - Projects  │
            │ - Customers │
            │             │
            │ Support:    │
            │ - Customers │
            │ - Support   │
            └─────────────┘
```

## 3. System Architecture

### 3.1 MVC + Repository Pattern

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│  React + TypeScript + Inertia.js + Tailwind CSS        │
├─────────────────────────────────────────────────────────┤
│                   CONTROLLERS                           │
│  ProductController | LeadController | ProjectController │
│  CustomerController | ReportController | etc.          │
├─────────────────────────────────────────────────────────┤
│                     SERVICES                            │
│   ProductService | LeadService | ProjectService         │
│   (Business Logic Layer)                                │
├─────────────────────────────────────────────────────────┤
│                   REPOSITORIES                          │
│   ProductRepository | LeadRepository | etc.             │
│   (Data Access Layer)                                   │
├─────────────────────────────────────────────────────────┤
│                      MODELS                             │
│   Product | Lead | Project | Customer | User            │
│   (Eloquent ORM)                                        │
├─────────────────────────────────────────────────────────┤
│                     DATABASE                            │
│                  PostgreSQL 14                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Security Layer

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    AUTH     │    │    ROLE     │    │ PERMISSION  │
│ MIDDLEWARE  │───▶│ MIDDLEWARE  │───▶│ MIDDLEWARE  │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ - Session   │    │ - Admin     │    │ - CRUD      │
│ - CSRF      │    │ - Manager   │    │ - Read Only │
│ - Throttle  │    │ - Sales     │    │ - Approve   │
└─────────────┘    │ - Support   │    │ - Report    │
                   └─────────────┘    └─────────────┘
```

## 4. API Endpoints Design

### 4.1 Main Application Routes

```
┌─────────────────────────────────────────────────────────┐
│                    WEB ROUTES                           │
├─────────────────────────────────────────────────────────┤
│ GET    /dashboard                                       │
│ GET    /products                                        │
│ POST   /products                                        │
│ GET    /leads                                           │
│ POST   /leads                                           │
│ GET    /projects                                        │
│ POST   /projects/{id}/approve                           │
│ GET    /customers                                       │
│ POST   /customers/{id}/services                         │
│ GET    /reports (Manager/Admin only)                    │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Customer Portal Routes

```
┌─────────────────────────────────────────────────────────┐
│                CUSTOMER PORTAL                          │
├─────────────────────────────────────────────────────────┤
│ GET    /customer-portal/login                           │
│ POST   /customer-portal/authenticate                    │
│ GET    /customer-portal/dashboard                       │
│ GET    /customer-portal/services                        │
│ GET    /customer-portal/billing                         │
│ GET    /customer-portal/support                         │
│ POST   /customer-portal/support/ticket                  │
└─────────────────────────────────────────────────────────┘
```

## 5. Database Performance Optimization

### 5.1 Indexing Strategy

```sql
-- Primary Performance Indexes
CREATE INDEX idx_leads_status_assigned ON leads(status, assigned_to);
CREATE INDEX idx_projects_status_date ON projects(status, created_at);
CREATE INDEX idx_customers_status_date ON customers(status, registration_date);
CREATE INDEX idx_services_customer_status ON customer_services(customer_id, status);

-- Search Optimization
CREATE INDEX idx_leads_name_email ON leads(name, email);
CREATE INDEX idx_customers_name_code ON customers(name, customer_code);

-- Reporting Optimization
CREATE INDEX idx_projects_value_date ON projects(estimated_value, created_at);
CREATE INDEX idx_services_fee_date ON customer_services(monthly_fee, activation_date);
```

### 5.2 Query Optimization Examples

```sql
-- Efficient Lead Conversion Report
SELECT 
    DATE_TRUNC('month', l.created_at) as month,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN l.status = 'closed_won' THEN 1 END) as conversions,
    ROUND(
        COUNT(CASE WHEN l.status = 'closed_won' THEN 1 END) * 100.0 / COUNT(*), 
        2
    ) as conversion_rate
FROM leads l
WHERE l.created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', l.created_at)
ORDER BY month;

-- Revenue Trend Analysis
SELECT 
    DATE_TRUNC('month', cs.activation_date) as month,
    SUM(cs.monthly_fee) as monthly_revenue,
    COUNT(DISTINCT cs.customer_id) as active_customers
FROM customer_services cs
WHERE cs.status = 'active'
    AND cs.activation_date >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', cs.activation_date)
ORDER BY month;
```

## 6. Deployment Architecture

### 6.1 Production Environment

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   NGINX     │    │   LARAVEL   │    │ POSTGRESQL  │
│   (Proxy)   │───▶│    APP      │───▶│     DB      │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ - SSL       │    │ - PHP-FPM   │    │ - Backup    │
│ - Static    │    │ - Queue     │    │ - Replica   │
│ - Cache     │    │ - Scheduler │    │ - Monitoring│
└─────────────┘    └─────────────┘    └─────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                   ┌─────────────┐
                   │    REDIS    │
                   │   (Cache +  │
                   │   Sessions) │
                   └─────────────┘
```

### 6.2 Scalability Considerations

- **Horizontal Scaling**: Load balancer untuk multiple app instances
- **Database Optimization**: Read replicas untuk reporting
- **Caching Strategy**: Redis untuk sessions dan frequent queries
- **Queue Processing**: Separate workers untuk email notifications
- **CDN Integration**: Static assets delivery
- **Monitoring**: Application performance monitoring (APM)

## 7. Security Measures

### 7.1 Authentication & Authorization

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   LOGIN     │    │    ROLE     │    │   ACCESS    │
│             │    │   CHECK     │    │  CONTROL    │
│ - Email +   │───▶│             │───▶│             │
│   Password  │    │ - Admin     │    │ - Feature   │
│ - CSRF      │    │ - Manager   │    │   based     │
│ - Rate      │    │ - Sales     │    │ - Resource  │
│   Limit     │    │ - Support   │    │   based     │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 7.2 Data Protection

- **Input Validation**: Laravel Form Requests
- **SQL Injection**: Eloquent ORM protection
- **XSS Protection**: Inertia.js auto-escaping
- **CSRF Protection**: Laravel middleware
- **Password Security**: Bcrypt hashing
- **Session Security**: Secure cookies, regeneration

---

**Document Version:** 1.0  
**Last Updated:** 31 Juli 2025  
**Prepared by:** PT. Smart Development Team
