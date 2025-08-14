# PT. Smart CRM - Customer Relationship Management System

> **Mulai Pengerjaan:** 13 Agustus 2025, 20:00 WIB  
> **Selesai Pengerjaan:** 14 Agustus 2025, 15:30 WIB  


## 🏢 **Tentang Project**

Aplikasi CRM untuk PT. Smart (Internet Service Provider) yang membantu divisi sales beralih dari sistem manual ke digital. Aplikasi ini mengelola lead, customer, produk layanan internet, dan project dengan sistem approval manager.

## 🚀 **Fitur Utama**

### **Core Features (Required)**
- ✅ **Authentication System** - Login/logout dengan role-based access
- ✅ **Lead Management** - Manajemen calon customer dengan status tracking
- ✅ **Product Management** - Master data layanan internet (speed, harga, billing cycle)
- ✅ **Project Workflow** - Proses konversi lead ke customer dengan approval manager
- ✅ **Customer Management** - Data customer aktif dengan list layanan berlangganan

### **Advanced Features (Bonus)**
- 📧 **Email Notifications** - Otomatis untuk workflow approval
- 🔐 **Role-Based Permissions** - Admin, Manager, Sales, Support roles  
- 🌐 **Customer Portal** - Self-service untuk customer (billing, support, services)
- ⚙️ **Service Management** - Add/remove/suspend/activate layanan customer
- 🎨 **Dark/Light Theme** - Mode gelap dan terang dengan toggle otomatis

## 🛠 **Tech Stack**

- **Backend:** Laravel 11 (PHP 8.2+)
- **Frontend:** React 18 + TypeScript + Inertia.js
- **Database:** PostgreSQL 14
- **Styling:** Tailwind CSS
- **Architecture:** Repository Pattern + Service Layer + DTOs

## 📦 **Instalasi & Setup**

### **Prerequisites**
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 14
- Git

### **Step 1: Clone Repository**
```bash
git clone https://github.com/[username]/[namarepository]_crm.git
cd [namarepository]_crm
```

### **Step 2: Install Dependencies**
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### **Step 3: Environment Configuration**
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### **Step 4: Database Setup**
Edit `.env` file dengan konfigurasi PostgreSQL:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=smart_crm
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Buat database dan jalankan migrasi:
```bash
# Buat database di PostgreSQL
createdb smart_crm

# Jalankan migrasi dan seeder
php artisan migrate:fresh --seed
```

### **Step 5: Build Assets**
```bash
# Development
npm run dev

# Production
npm run build
```

### **Step 6: Start Application**
```bash
# Start Laravel server
php artisan serve

# Aplikasi akan berjalan di http://localhost:8000
```

## 👥 **Default Users**

Setelah seeding, tersedia user default:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| Admin | admin@smart.com | password | Full access |
| Manager | manager@smart.com | password | All features + approvals |
| Sales 1 | sales1@smart.com | password | Leads + projects + customers |
| Sales 2 | sales2@smart.com | password | Leads + projects + customers |

## 🗃 **Database Schema**

### **Core Tables**
- `users` - System users dengan roles
- `products` - Master layanan internet (speed, harga, billing)
- `leads` - Calon customer dengan status tracking
- `projects` - Workflow konversi lead dengan approval
- `customers` - Customer aktif dengan data berlangganan
- `customer_services` - Layanan yang berlangganan customer

### **Supporting Tables**
- `notifications` - Email notifications log
- `password_reset_tokens` - Password reset system
- `sessions` - User session management

## 📊 **Business Flow**

```
Lead → Project (dengan approval) → Customer → Service Management
  ↓         ↓                        ↓            ↓
Status   Approval                Billing    Add/Suspend/
Track    Manager                 Portal     Activate
```

1. **Lead Management:** Sales input calon customer dengan data lengkap
2. **Project Creation:** Konversi lead ke project dengan assign produk
3. **Manager Approval:** Manager approve/reject project
4. **Customer Creation:** Project approved otomatis jadi customer
5. **Service Management:** Kelola layanan customer (add/suspend/activate)

## 🔐 **Role & Permissions**

| Feature | Admin | Manager | Sales | Support |
|---------|-------|---------|-------|---------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ❌ | ❌ |
| Leads | ✅ | ✅ | ✅ | ❌ |
| Projects | ✅ | ✅ | ✅ | ❌ |
| Customers | ✅ | ✅ | ✅ | ✅ |
| Project Approvals | ✅ | ✅ | ❌ | ❌ |
| Theme Toggle | ✅ | ✅ | ✅ | ✅ |

## 🌐 **Customer Portal**

Akses: `/customer-portal/login`

**Features:**
- Dashboard overview services & billing
- Service management dan detail teknis
- Billing history dan outstanding balance
- Support ticket system dengan FAQ

**Login:** Customer Code + Email

## 🎯 **Project Workflow**

Workflow approval yang efisien:
- Project status: pending → in_progress → waiting_approval → approved/rejected → completed
- Manager approval dengan notification system
- Role hierarchy: Admin > Manager > Sales > Support
- Automatic status tracking dan timestamp

## 🔧 **Development Tools**

### **Recommended Tools**
- **DBeaver** - Database management dan query builder
- **Draw.io** - ERD dan flow diagram
- **Postman** - API testing (jika diperlukan)

### **Code Quality**
- Repository Pattern untuk data access layer
- Service Layer untuk business logic
- DTOs untuk data transfer
- Middleware untuk authentication & authorization
- Form validation dengan Laravel Request classes

## 📁 **Project Structure**

```
app/
├── DTOs/              # Data Transfer Objects
├── Http/
│   ├── Controllers/   # Route controllers
│   ├── Middleware/    # Custom middleware
│   └── Requests/      # Form validation
├── Models/            # Eloquent models
├── Notifications/     # Email notifications
├── Repositories/      # Data access layer
└── Services/          # Business logic layer

resources/
├── js/
│   ├── Components/    # Reusable React components
│   ├── Layouts/       # Page layouts
│   ├── Pages/         # Page components
│   └── types/         # TypeScript definitions
└── views/             # Blade templates

database/
├── migrations/        # Database migrations
├── seeders/           # Data seeders
└── factories/         # Model factories
```

## 🚀 **Deployment**

### **Production Setup**
```bash
# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build production assets
npm run build

# Set proper permissions
chmod -R 755 storage bootstrap/cache
```

### **Environment Variables**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password

# Mail (untuk notifications)
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
```

## 🧪 **Testing**

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit
```

## 📝 **API Documentation**

Jika diperlukan integrasi:
- Authentication: Laravel Sanctum ready
- RESTful endpoints tersedia
- JSON responses dengan consistent format

## 🤝 **Contributing**

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is proprietary software for PT. Smart ISP.

## 📞 **Support**

Untuk pertanyaan teknis atau bantuan deployment:
- Email: developer@smart.com
- Documentation: [Link to detailed docs]

---

**Made with ❤️ for PT. Smart ISP Digital Transformation**

## 📊 **Database Query Examples**

Query simulasi tersedia di `data_dictionary.md` untuk:
- User management dan role analysis
- Lead conversion tracking
- Project workflow monitoring  
- Customer service analytics
- Revenue calculations
- Performance metrics

---

**Laravel Framework License**: [MIT License](https://opensource.org/licenses/MIT)
