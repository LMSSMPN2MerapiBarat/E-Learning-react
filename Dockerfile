# ======================
# FRONTEND BUILD (Vite)
# ======================
FROM node:20-alpine AS frontend
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ======================
# BACKEND DEPENDENCIES (Composer + GD)
# ======================
FROM php:8.3-cli AS vendor
WORKDIR /app

RUN apt-get update && apt-get install -y \
    unzip git curl \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install gd zip \
 && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-scripts \
    --optimize-autoloader


# ======================
# FINAL IMAGE (RAILWAY SAFE)
# ======================
FROM php:8.3-cli
WORKDIR /app

RUN apt-get update && apt-get install -y \
    unzip git \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install gd pdo_mysql zip \
 && rm -rf /var/lib/apt/lists/*

# Copy Laravel source
COPY . .

# Copy vendor & frontend build
COPY --from=vendor /app/vendor /app/vendor
COPY --from=frontend /app/public/build /app/public/build

EXPOSE 8080

# ======================
# RUNTIME COMMAND
# ======================
CMD mkdir -p \
      storage/framework/cache \
      storage/framework/sessions \
      storage/framework/views \
      bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache \
 && php artisan storage:link || true \
 && php artisan migrate --force || true \
 && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
