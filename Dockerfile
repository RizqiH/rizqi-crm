FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd \
    && rm -rf /var/lib/apt/lists/*

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy package.json files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy all application files
COPY . .

# Build assets
RUN npm run build

# Set up Laravel
RUN cp .env.example .env \
    && php artisan key:generate \
    && php artisan config:clear \
    && php artisan cache:clear

# Set permissions
RUN chmod -R 755 storage bootstrap/cache

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
