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
- 📊 **Advanced Reporting** - Analytics revenue, conversion rate, performance
- 📧 **Email Notifications** - Otomatis untuk workflow approval
- 🔐 **Role-Based Permissions** - Admin, Manager, Sales, Support roles
- 🌐 **Customer Portal** - Self-service untuk customer (billing, support, services)
- ⚙️ **Service Management** - Add/remove/suspend/activate layanan customer

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
| Manager | manager@smart.com | password | Reports + approvals |
| Sales | sales@smart.com | password | Leads + customers |
| Support | support@smart.com | password | Customer support |

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
| Reports | ✅ | ✅ | ❌ | ❌ |
| Approvals | ✅ | ✅ | ❌ | ❌ |

## 🌐 **Customer Portal**

Akses: `/customer-portal/login`

**Features:**
- Dashboard overview services & billing
- Service management dan detail teknis
- Billing history dan outstanding balance
- Support ticket system dengan FAQ

**Login:** Customer Code + Email

## 📈 **Reporting & Analytics**

Tersedia untuk Manager & Admin:
- Revenue trends dan growth analysis
- Lead conversion rate tracking
- Project performance metrics
- Customer analytics dan retention
- Top performing products

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

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
