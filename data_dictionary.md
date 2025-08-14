# PT. Smart CRM - Data Dictionary

## Database: smart_crm
**Version:** 1.0  
**DBMS:** PostgreSQL 14  
**Created:** 29 Juli 2025  

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
