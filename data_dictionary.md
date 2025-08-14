# PT. Smart CRM - Data Dictionary

## Database: smart_crm
**Version:** 1.0  
**DBMS:** PostgreSQL 14  
**Created:** 14 Agustus 2025  

---

## Table: users
**Purpose:** Menyimpan data pengguna sistem dengan role-based access

| Column | Type | Length | Null | Default | Description |
|--------|------|--------|------|---------|-------------|
| id | BIGSERIAL | - | NO | AUTO | Primary key, auto increment |
| name | VARCHAR | 255 | NO | - | Nama lengkap pengguna |
| email | VARCHAR | 255 | NO | - | Email unik untuk login |
| email_verified_at | TIMESTAMP | - | YES | NULL | Waktu verifikasi email |
| password | VARCHAR | 255 | NO | - | Password ter-hash |
| role | VARCHAR | 50 | NO | 'sales' | Role: admin, manager, sales, support |
| remember_token | VARCHAR | 100 | YES | NULL | Token untuk remember me |
| created_at | TIMESTAMP | - | YES | NULL | Waktu pembuatan record |
| updated_at | TIMESTAMP | - | YES | NULL | Waktu update terakhir |

**Constraints:**
- PRIMARY KEY: id
- UNIQUE: email
- CHECK: role IN ('admin', 'manager', 'sales', 'support')

**Indexes:**
- idx_users_email ON (email)
- idx_users_role ON (role)

---

## Table: products
**Purpose:** Master data produk/layanan internet yang ditawarkan

| Column | Type | Length | Null | Default | Description |
|--------|------|--------|------|---------|-------------|
| id | BIGSERIAL | - | NO | AUTO | Primary key, auto increment |
| name | VARCHAR | 255 | NO | - | Nama produk/paket internet |
| description | TEXT | - | YES | NULL | Deskripsi detail produk |
| type | VARCHAR | 100 | NO | 'internet' | Jenis layanan |
| price | DECIMAL | 10,2 | NO | - | Harga dalam rupiah |
| billing_cycle | VARCHAR | 20 | NO | 'monthly' | Siklus tagihan: monthly, yearly |
| speed_mbps | INTEGER | - | YES | NULL | Kecepatan internet dalam Mbps |
| is_active | BOOLEAN | - | NO | TRUE | Status aktif produk |
| created_at | TIMESTAMP | - | YES | NULL | Waktu pembuatan record |
| updated_at | TIMESTAMP | - | YES | NULL | Waktu update terakhir |

**Constraints:**
- PRIMARY KEY: id
- CHECK: billing_cycle IN ('monthly', 'yearly')

**Indexes:**
- idx_products_type ON (type)
- idx_products_active ON (is_active)

---

## Table: leads
**Purpose:** Data calon customer/prospek yang akan diproses sales

| Column | Type | Length | Null | Default | Description |
|--------|------|--------|------|---------|-------------|
| id | BIGSERIAL | - | NO | AUTO | Primary key, auto increment |
| name | VARCHAR | 255 | NO | - | Nama calon customer |
| email | VARCHAR | 255 | NO | - | Email calon customer |
| phone | VARCHAR | 50 | YES | NULL | Nomor telepon |
| company | VARCHAR | 255 | YES | NULL | Nama perusahaan |
| address | TEXT | - | YES | NULL | Alamat lengkap |
| source | VARCHAR | 100 | YES | NULL | Sumber lead (website, referral, dll) |
| status | VARCHAR | 50 | NO | 'new' | Status proses lead |
| notes | TEXT | - | YES | NULL | Catatan tambahan |
| assigned_to | BIGINT | - | YES | NULL | ID user yang menangani |
| created_at | TIMESTAMP | - | YES | NULL | Waktu pembuatan record |
| updated_at | TIMESTAMP | - | YES | NULL | Waktu update terakhir |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: assigned_to REFERENCES users(id)
- CHECK: status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')

**Indexes:**
- idx_leads_status ON (status)
- idx_leads_assigned_to ON (assigned_to)
- idx_leads_email ON (email)

---

## Table: projects
**Purpose:** Project untuk memproses lead menjadi customer dengan approval workflow

| Column | Type | Length | Null | Default | Description |
|--------|------|--------|------|---------|-------------|
| id | BIGSERIAL | - | NO | AUTO | Primary key, auto increment |
| title | VARCHAR | 255 | NO | - | Judul project |
| description | TEXT | - | YES | NULL | Deskripsi project |
| lead_id | BIGINT | - | NO | - | ID lead yang diproses |
| product_id | BIGINT | - | NO | - | ID produk yang ditawarkan |
| assigned_to | BIGINT | - | NO | - | ID user yang mengerjakan |
| status | VARCHAR | 50 | NO | 'pending' | Status project |
| estimated_value | DECIMAL | 12,2 | YES | NULL | Estimasi nilai project |
| expected_start_date | DATE | - | YES | NULL | Tanggal mulai diharapkan |
| expected_completion_date | DATE | - | YES | NULL | Tanggal selesai diharapkan |
| notes | TEXT | - | YES | NULL | Catatan project |
| approved_by | BIGINT | - | YES | NULL | ID manager yang approve |
| approved_at | TIMESTAMP | - | YES | NULL | Waktu approval |
| rejection_reason | TEXT | - | YES | NULL | Alasan jika ditolak |
| created_at | TIMESTAMP | - | YES | NULL | Waktu pembuatan record |
| updated_at | TIMESTAMP | - | YES | NULL | Waktu update terakhir |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: lead_id REFERENCES leads(id)
- FOREIGN KEY: product_id REFERENCES products(id)
- FOREIGN KEY: assigned_to REFERENCES users(id)
- FOREIGN KEY: approved_by REFERENCES users(id)
- CHECK: status IN ('pending', 'in_progress', 'waiting_approval', 'approved', 'rejected', 'completed')

**Indexes:**
- idx_projects_status ON (status)
- idx_projects_lead_id ON (lead_id)
- idx_projects_assigned_to ON (assigned_to)
- idx_projects_approved_by ON (approved_by)

---

## Table: customers
**Purpose:** Data customer aktif yang sudah berlangganan

| Column | Type | Length | Null | Default | Description |
|--------|------|--------|------|---------|-------------|
| id | BIGSERIAL | - | NO | AUTO | Primary key, auto increment |
| customer_code | VARCHAR | 20 | NO | - | Kode unique customer |
| name | VARCHAR | 255 | NO | - | Nama customer |
| email | VARCHAR | 255 | NO | - | Email customer |
| phone | VARCHAR | 50 | YES | NULL | Nomor telepon |
| company | VARCHAR | 255 | YES | NULL | Nama perusahaan |
| billing_address | TEXT | - | NO | - | Alamat tagihan |
| installation_address | TEXT | - | YES | NULL | Alamat instalasi |
| status | VARCHAR | 20 | NO | 'active' | Status customer |
| registration_date | DATE | - | NO | CURRENT_DATE | Tanggal registrasi |
| lead_id | BIGINT | - | YES | NULL | ID lead asal (jika ada) |
| notes | TEXT | - | YES | NULL | Catatan customer |
| created_at | TIMESTAMP | - | YES | NULL | Waktu pembuatan record |
| updated_at | TIMESTAMP | - | YES | NULL | Waktu update terakhir |

**Constraints:**
- PRIMARY KEY: id
- UNIQUE: customer_code
- FOREIGN KEY: lead_id REFERENCES leads(id)
- CHECK: status IN ('active', 'suspended', 'terminated')

**Indexes:**
- idx_customers_code ON (customer_code)
- idx_customers_status ON (status)
- idx_customers_email ON (email)

---

## Table: customer_services
**Purpose:** Layanan yang berlangganan oleh customer

| Column | Type | Length | Null | Default | Description |
|--------|------|--------|------|---------|-------------|
| id | BIGSERIAL | - | NO | AUTO | Primary key, auto increment |
| customer_id | BIGINT | - | NO | - | ID customer pemilik layanan |
| product_id | BIGINT | - | NO | - | ID produk yang berlangganan |
| service_number | VARCHAR | 50 | NO | - | Nomor unique layanan |
| status | VARCHAR | 20 | NO | 'active' | Status layanan |
| activation_date | DATE | - | NO | CURRENT_DATE | Tanggal aktivasi |
| expiry_date | DATE | - | YES | NULL | Tanggal kadaluarsa |
| monthly_fee | DECIMAL | 10,2 | NO | - | Biaya bulanan |
| installation_notes | TEXT | - | YES | NULL | Catatan instalasi |
| technical_notes | TEXT | - | YES | NULL | Catatan teknis |
| created_at | TIMESTAMP | - | YES | NULL | Waktu pembuatan record |
| updated_at | TIMESTAMP | - | YES | NULL | Waktu update terakhir |

**Constraints:**
- PRIMARY KEY: id
- UNIQUE: service_number
- FOREIGN KEY: customer_id REFERENCES customers(id)
- FOREIGN KEY: product_id REFERENCES products(id)
- CHECK: status IN ('active', 'suspended', 'terminated')

**Indexes:**
- idx_customer_services_customer_id ON (customer_id)
- idx_customer_services_status ON (status)
- idx_customer_services_service_number ON (service_number)

---

## Business Rules & Relationships

### Lead → Project → Customer Flow
1. **Lead** dibuat oleh sales dengan status 'new'
2. **Project** dibuat untuk memproses lead dengan produk tertentu
3. Project harus di-approve manager sebelum jadi customer
4. Setelah approved, otomatis terbuat **Customer** dan **Customer Service**

### Role-Based Access
- **Admin**: Full access semua fitur
- **Manager**: Access reports, approval, semua CRUD kecuali products
- **Sales**: Access leads, projects, customers (no reports)
- **Support**: Access customers dan support features

### Status Workflows

#### Lead Status Flow:
new → contacted → qualified → proposal → negotiation → closed_won/closed_lost

#### Project Status Flow:
pending → in_progress → waiting_approval → approved/rejected → completed

#### Customer Status:
active → suspended → terminated (atau reactivated)

### Customer Portal Access
- Login menggunakan customer_code + email
- Self-service untuk billing, services, support tickets

---

## Performance Considerations

### Indexes
- Semua foreign keys sudah di-index
- Status fields di-index untuk filtering cepat
- Email fields di-index untuk pencarian

### Query Optimization
- Join tables menggunakan proper indexes
- Pagination untuk large datasets
- Eager loading untuk relationships

### Data Integrity
- Foreign key constraints untuk referential integrity
- Check constraints untuk enum values
- Unique constraints untuk business keys


### 1) Ringkasan user per role

```sql
SELECT role, COUNT(*) AS total
FROM users
GROUP BY role
ORDER BY total DESC;
```

### 2) Projects menunggu approval

```sql
SELECT id, title, status, created_at
FROM projects
WHERE status IN ('waiting_approval', 'pending_approval')
ORDER BY created_at DESC
LIMIT 20;
```

### 3) Jumlah project approved hari ini

```sql
SELECT COUNT(*) AS approved_today
FROM projects
WHERE status = 'approved'
  AND approved_at::date = CURRENT_DATE;
```

### 4) Funnel leads per status

```sql
SELECT status, COUNT(*) AS total
FROM leads
GROUP BY status
ORDER BY total DESC;
```

### 5) Konversi leads → customers

```sql
-- Total customers
SELECT COUNT(*) AS total_customers FROM customers;

-- Customers yang memiliki asal lead
SELECT COUNT(*) AS customers_with_lead
FROM customers
WHERE lead_id IS NOT NULL;
```

### 6) Customers dengan jumlah layanan aktif

```sql
SELECT c.id, c.name,
       COUNT(cs.id) AS active_services
FROM customers c
LEFT JOIN customer_services cs
  ON cs.customer_id = c.id AND cs.status = 'active'
GROUP BY c.id, c.name
ORDER BY active_services DESC, c.name;
```

### 7) Ringkasan support tickets (sesuaikan kolom/status bila berbeda)

```sql
SELECT status, COUNT(*) AS total
FROM support_tickets
GROUP BY status
ORDER BY total DESC;
```

### 8) Health check data inti

```sql
SELECT (SELECT COUNT(*) FROM users)          AS users,
       (SELECT COUNT(*) FROM leads)          AS leads,
       (SELECT COUNT(*) FROM projects)       AS projects,
       (SELECT COUNT(*) FROM customers)      AS customers;
```

---

## All Query Simulations

Simulasi semua query yang digunakan dalam aplikasi PT. Smart CRM, disesuaikan dengan business logic dan use cases yang ada.

### 🔐 **Authentication & User Management**

#### Login authentication
```sql
-- Cek user untuk login
SELECT id, name, email, role, password, email_verified_at
FROM users 
WHERE email = 'admin@smart.com' 
  AND deleted_at IS NULL;
```

#### Role hierarchy check
```sql
-- Cek hierarchical role access (Admin > Manager > Sales > Support)
SELECT role,
       CASE 
         WHEN role = 'admin' THEN 'admin,manager,sales,support'
         WHEN role = 'manager' THEN 'manager,sales,support'  
         WHEN role = 'sales' THEN 'sales,support'
         WHEN role = 'support' THEN 'support'
       END AS accessible_roles
FROM users 
WHERE id = 1;
```

#### User statistics by role
```sql
-- Dashboard user analytics
SELECT role, 
       COUNT(*) as total_users,
       COUNT(CASE WHEN email_verified_at IS NOT NULL THEN 1 END) as verified_users,
       COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d
FROM users 
GROUP BY role 
ORDER BY total_users DESC;
```

### 📋 **Lead Management Queries**

#### Lead search with pagination
```sql
-- Search leads dengan multiple criteria (LIKE search + filters)
SELECT l.id, l.name, l.email, l.phone, l.company, l.status, 
       l.created_at, u.name as assigned_to_name
FROM leads l
LEFT JOIN users u ON l.assigned_to = u.id
WHERE (l.name ILIKE '%company%' 
   OR l.email ILIKE '%company%' 
   OR l.company ILIKE '%company%' 
   OR l.phone ILIKE '%company%')
  AND l.status = 'new'
  AND l.assigned_to = 3
ORDER BY l.created_at DESC
LIMIT 10 OFFSET 0;
```

#### Lead conversion funnel
```sql
-- Lead conversion analysis (lead status flow)
SELECT status,
       COUNT(*) as total,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM leads
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'new' THEN 1
    WHEN 'contacted' THEN 2
    WHEN 'qualified' THEN 3
    WHEN 'proposal' THEN 4
    WHEN 'negotiation' THEN 5
    WHEN 'closed_won' THEN 6
    WHEN 'closed_lost' THEN 7
  END;
```

#### Lead performance by sales
```sql
-- Lead performance per sales user
SELECT u.name as sales_name,
       COUNT(l.id) as total_leads,
       COUNT(CASE WHEN l.status = 'closed_won' THEN 1 END) as won_leads,
       COUNT(CASE WHEN l.status = 'closed_lost' THEN 1 END) as lost_leads,
       ROUND(
         COUNT(CASE WHEN l.status = 'closed_won' THEN 1 END) * 100.0 / 
         NULLIF(COUNT(CASE WHEN l.status IN ('closed_won', 'closed_lost') THEN 1 END), 0), 
         2
       ) as conversion_rate
FROM users u
LEFT JOIN leads l ON u.id = l.assigned_to
WHERE u.role IN ('sales', 'manager', 'admin')
GROUP BY u.id, u.name
ORDER BY conversion_rate DESC NULLS LAST;
```

#### Qualified leads for projects
```sql
-- Get qualified leads yang siap dijadikan project
SELECT id, name, company, email, phone, status
FROM leads 
WHERE status IN ('qualified', 'proposal', 'negotiation')
  AND deleted_at IS NULL
ORDER BY created_at DESC;
```

### 📊 **Project Management Queries**

#### Project dashboard dengan relationships
```sql
-- Project list dengan lead, product, dan assigned user info
SELECT p.id, p.title, p.status, p.estimated_value,
       p.expected_start_date, p.expected_completion_date,
       p.created_at, p.approved_at,
       l.name as lead_name, l.company as lead_company,
       pr.name as product_name, pr.price as product_price,
       u_assigned.name as assigned_to_name,
       u_approved.name as approved_by_name
FROM projects p
JOIN leads l ON p.lead_id = l.id
JOIN products pr ON p.product_id = pr.id
LEFT JOIN users u_assigned ON p.assigned_to = u_assigned.id
LEFT JOIN users u_approved ON p.approved_by = u_approved.id
ORDER BY p.created_at DESC
LIMIT 10;
```

#### Project filtering dengan multiple criteria
```sql
-- Advanced project filtering (status, date range, assigned user)
SELECT p.*, l.name as lead_name, pr.name as product_name
FROM projects p
JOIN leads l ON p.lead_id = l.id  
JOIN products pr ON p.product_id = pr.id
WHERE p.status = 'waiting_approval'
  AND p.created_at >= '2025-01-01'
  AND p.created_at <= '2025-12-31'
  AND p.assigned_to = 3
ORDER BY p.created_at DESC;
```

#### Project workflow status tracking
```sql
-- Project status workflow analysis
SELECT 
  status,
  COUNT(*) as count,
  AVG(EXTRACT(days FROM (COALESCE(approved_at, NOW()) - created_at))) as avg_days_in_status,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_7d
FROM projects
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'pending' THEN 1
    WHEN 'in_progress' THEN 2  
    WHEN 'waiting_approval' THEN 3
    WHEN 'approved' THEN 4
    WHEN 'rejected' THEN 5
    WHEN 'completed' THEN 6
  END;
```

#### Projects pending approval (Manager view)
```sql
-- Projects waiting for manager approval
SELECT p.id, p.title, p.status, p.estimated_value,
       p.created_at, l.name as lead_name, l.company,
       pr.name as product_name, pr.price,
       u.name as submitted_by
FROM projects p
JOIN leads l ON p.lead_id = l.id
JOIN products pr ON p.product_id = pr.id  
JOIN users u ON p.assigned_to = u.id
WHERE p.status = 'waiting_approval'
ORDER BY p.created_at ASC;
```

#### Project revenue calculations
```sql
-- Project value analysis
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_projects,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_projects,
  SUM(estimated_value) as total_estimated_value,
  SUM(CASE WHEN status = 'approved' THEN estimated_value ELSE 0 END) as approved_value,
  AVG(estimated_value) as avg_project_value
FROM projects
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### 🛍️ **Product Management Queries**

#### Product catalog dengan filtering
```sql
-- Product search dan filter (name, type, active status)
SELECT id, name, description, type, price, billing_cycle, 
       speed_mbps, is_active, created_at
FROM products
WHERE (name ILIKE '%internet%' 
   OR description ILIKE '%internet%' 
   OR type ILIKE '%internet%')
  AND type = 'internet'
  AND is_active = true
ORDER BY created_at DESC
LIMIT 10;
```

#### Product performance analysis
```sql
-- Product usage di projects dan customer services
SELECT p.id, p.name, p.price, p.speed_mbps,
       COUNT(DISTINCT proj.id) as project_count,
       COUNT(DISTINCT cs.id) as active_service_count,
       SUM(cs.monthly_fee) as monthly_revenue
FROM products p
LEFT JOIN projects proj ON p.id = proj.product_id
LEFT JOIN customer_services cs ON p.id = cs.product_id AND cs.status = 'active'
WHERE p.is_active = true
GROUP BY p.id, p.name, p.price, p.speed_mbps
ORDER BY monthly_revenue DESC NULLS LAST;
```

#### Products by type and speed
```sql
-- Product grouping by type dan speed range
SELECT type, 
       CASE 
         WHEN speed_mbps <= 10 THEN 'Basic (≤10 Mbps)'
         WHEN speed_mbps <= 50 THEN 'Standard (11-50 Mbps)'
         WHEN speed_mbps <= 100 THEN 'Premium (51-100 Mbps)'
         ELSE 'Enterprise (>100 Mbps)'
       END as speed_category,
       COUNT(*) as product_count,
       AVG(price) as avg_price,
       MIN(price) as min_price,
       MAX(price) as max_price
FROM products
WHERE is_active = true
GROUP BY type, speed_category
ORDER BY type, min_price;
```

### 👥 **Customer Management Queries**

#### Customer search dengan services
```sql
-- Customer search dengan active services count
SELECT c.id, c.customer_code, c.name, c.email, c.company,
       c.status, c.registration_date,
       COUNT(cs.id) as active_services,
       SUM(cs.monthly_fee) as total_monthly_fee,
       l.name as original_lead_name
FROM customers c
LEFT JOIN customer_services cs ON c.id = cs.customer_id AND cs.status = 'active'
LEFT JOIN leads l ON c.lead_id = l.id
WHERE (c.name ILIKE '%search%' OR c.customer_code ILIKE '%search%')
  AND c.status = 'active'
GROUP BY c.id, c.customer_code, c.name, c.email, c.company, 
         c.status, c.registration_date, l.name
ORDER BY c.registration_date DESC;
```

#### Customer revenue analysis
```sql
-- Customer revenue ranking
SELECT c.id, c.customer_code, c.name, c.company,
       COUNT(cs.id) as service_count,
       SUM(cs.monthly_fee) as monthly_revenue,
       SUM(cs.monthly_fee) * 12 as annual_revenue,
       MIN(cs.activation_date) as first_service_date,
       MAX(cs.activation_date) as latest_service_date
FROM customers c
JOIN customer_services cs ON c.id = cs.customer_id
WHERE c.status = 'active' AND cs.status = 'active'
GROUP BY c.id, c.customer_code, c.name, c.company
ORDER BY monthly_revenue DESC
LIMIT 20;
```

#### Customer lifecycle analysis
```sql
-- Customer registration trends dan retention
SELECT 
  DATE_TRUNC('month', registration_date) as month,
  COUNT(*) as new_customers,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_customers,
  COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_customers,
  COUNT(CASE WHEN status = 'terminated' THEN 1 END) as terminated_customers
FROM customers
WHERE registration_date >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', registration_date)
ORDER BY month DESC;
```

### 🔧 **Customer Services Queries**

#### Service portfolio per customer  
```sql
-- Customer service details dengan product info
SELECT c.customer_code, c.name as customer_name,
       cs.service_number, cs.status, cs.activation_date,
       cs.monthly_fee, cs.expiry_date,
       p.name as product_name, p.type, p.speed_mbps,
       EXTRACT(days FROM (COALESCE(cs.expiry_date, NOW()) - cs.activation_date)) as service_duration_days
FROM customers c
JOIN customer_services cs ON c.id = cs.customer_id
JOIN products p ON cs.product_id = p.id
WHERE c.id = 1
ORDER BY cs.activation_date DESC;
```

#### Service management operations
```sql
-- Service status changes dan revenue impact
SELECT 
  cs.status,
  COUNT(*) as service_count,
  SUM(cs.monthly_fee) as total_monthly_revenue,
  AVG(cs.monthly_fee) as avg_service_fee,
  COUNT(CASE WHEN cs.activation_date >= NOW() - INTERVAL '30 days' THEN 1 END) as new_activations_30d
FROM customer_services cs
JOIN customers c ON cs.customer_id = c.id
WHERE c.status = 'active'
GROUP BY cs.status
ORDER BY total_monthly_revenue DESC;
```

#### Revenue trends by service type
```sql
-- Monthly revenue trends by product type
SELECT 
  DATE_TRUNC('month', cs.activation_date) as month,
  p.type as product_type,
  COUNT(cs.id) as new_services,
  SUM(cs.monthly_fee) as monthly_revenue,
  AVG(cs.monthly_fee) as avg_service_fee
FROM customer_services cs
JOIN products p ON cs.product_id = p.id
WHERE cs.activation_date >= NOW() - INTERVAL '12 months'
  AND cs.status = 'active'
GROUP BY DATE_TRUNC('month', cs.activation_date), p.type
ORDER BY month DESC, monthly_revenue DESC;
```

### 📈 **Business Intelligence & Analytics**

#### Complete sales funnel analysis
```sql
-- End-to-end conversion: Leads → Projects → Customers → Revenue
WITH lead_stats AS (
  SELECT 
    COUNT(*) as total_leads,
    COUNT(CASE WHEN status = 'closed_won' THEN 1 END) as won_leads
  FROM leads
), project_stats AS (
  SELECT 
    COUNT(*) as total_projects,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_projects
  FROM projects  
), customer_stats AS (
  SELECT 
    COUNT(*) as total_customers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_customers
  FROM customers
), revenue_stats AS (
  SELECT 
    SUM(monthly_fee) as monthly_revenue,
    SUM(monthly_fee) * 12 as annual_revenue
  FROM customer_services cs
  JOIN customers c ON cs.customer_id = c.id
  WHERE cs.status = 'active' AND c.status = 'active'
)
SELECT 
  l.total_leads,
  l.won_leads,
  ROUND(l.won_leads * 100.0 / l.total_leads, 2) as lead_conversion_rate,
  p.total_projects,
  p.approved_projects, 
  ROUND(p.approved_projects * 100.0 / p.total_projects, 2) as project_approval_rate,
  c.total_customers,
  c.active_customers,
  ROUND(c.active_customers * 100.0 / c.total_customers, 2) as customer_retention_rate,
  r.monthly_revenue,
  r.annual_revenue,
  ROUND(r.monthly_revenue / NULLIF(c.active_customers, 0), 2) as avg_revenue_per_customer
FROM lead_stats l, project_stats p, customer_stats c, revenue_stats r;
```

#### Dashboard metrics untuk management
```sql
-- Key metrics untuk dashboard
SELECT 
  'leads' as metric_type,
  COUNT(*) as total,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_7d,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_30d
FROM leads
UNION ALL
SELECT 
  'projects' as metric_type,
  COUNT(*) as total,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_7d,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_30d
FROM projects
UNION ALL
SELECT 
  'customers' as metric_type,
  COUNT(*) as total,
  COUNT(CASE WHEN registration_date >= NOW() - INTERVAL '7 days' THEN 1 END) as new_7d,
  COUNT(CASE WHEN registration_date >= NOW() - INTERVAL '30 days' THEN 1 END) as new_30d
FROM customers;
```

### 🔍 **Advanced Search & Filtering**

#### Global search across entities
```sql
-- Global search: leads, customers, projects
(SELECT 'lead' as type, id, name, email, NULL as customer_code, created_at
 FROM leads 
 WHERE name ILIKE '%search_term%' OR email ILIKE '%search_term%' OR company ILIKE '%search_term%')
UNION ALL
(SELECT 'customer' as type, id, name, email, customer_code, registration_date as created_at
 FROM customers
 WHERE name ILIKE '%search_term%' OR email ILIKE '%search_term%' OR customer_code ILIKE '%search_term%')
UNION ALL  
(SELECT 'project' as type, id, title as name, NULL as email, NULL as customer_code, created_at
 FROM projects
 WHERE title ILIKE '%search_term%' OR description ILIKE '%search_term%')
ORDER BY created_at DESC
LIMIT 20;
```

#### Complex date-based analytics
```sql
-- Time-based performance comparison (current vs previous period)
WITH current_period AS (
  SELECT 
    COUNT(DISTINCT l.id) as leads,
    COUNT(DISTINCT p.id) as projects,  
    COUNT(DISTINCT c.id) as customers,
    SUM(DISTINCT cs.monthly_fee) as revenue
  FROM leads l
  FULL OUTER JOIN projects p ON DATE_TRUNC('month', p.created_at) = DATE_TRUNC('month', l.created_at)
  FULL OUTER JOIN customers c ON DATE_TRUNC('month', c.registration_date) = DATE_TRUNC('month', l.created_at)
  FULL OUTER JOIN customer_services cs ON cs.customer_id = c.id AND cs.status = 'active'
  WHERE l.created_at >= DATE_TRUNC('month', NOW())
), previous_period AS (
  SELECT 
    COUNT(DISTINCT l.id) as leads,
    COUNT(DISTINCT p.id) as projects,
    COUNT(DISTINCT c.id) as customers,
    SUM(DISTINCT cs.monthly_fee) as revenue
  FROM leads l
  FULL OUTER JOIN projects p ON DATE_TRUNC('month', p.created_at) = DATE_TRUNC('month', l.created_at)
  FULL OUTER JOIN customers c ON DATE_TRUNC('month', c.registration_date) = DATE_TRUNC('month', l.created_at)
  FULL OUTER JOIN customer_services cs ON cs.customer_id = c.id AND cs.status = 'active'
  WHERE l.created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
    AND l.created_at < DATE_TRUNC('month', NOW())
)
SELECT 
  cp.leads as current_leads, pp.leads as previous_leads,
  ROUND((cp.leads - pp.leads) * 100.0 / NULLIF(pp.leads, 0), 2) as leads_growth_pct,
  cp.projects as current_projects, pp.projects as previous_projects,
  ROUND((cp.projects - pp.projects) * 100.0 / NULLIF(pp.projects, 0), 2) as projects_growth_pct,
  cp.customers as current_customers, pp.customers as previous_customers,
  ROUND((cp.customers - pp.customers) * 100.0 / NULLIF(pp.customers, 0), 2) as customers_growth_pct
FROM current_period cp, previous_period pp;
```

### 🎯 **Performance & Optimization Queries**

#### Database health check
```sql
-- Table statistics dan performance metrics
SELECT 
  schemaname,
  tablename,
  attname as column_name,
  n_distinct,
  correlation,
  most_common_vals
FROM pg_stats 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'leads', 'projects', 'customers', 'customer_services', 'products')
ORDER BY tablename, attname;
```

#### Index usage analysis
```sql
-- Check index usage untuk optimization
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch,
  idx_scan
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

Catatan eksekusi:
- Semua query di atas menggunakan PostgreSQL syntax dan features
- Query dapat dijalankan via psql, DBeaver, atau Laravel Tinker
- Parameter dan filter values harus disesuaikan dengan data aktual
- Untuk production, tambahkan LIMIT dan INDEX yang sesuai untuk performance optimal
