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
# BACKEND DEPENDENCIES (Composer)
# ======================
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
  --no-dev \
  --prefer-dist \
  --no-interaction \
  --no-scripts \
  --optimize-autoloader

# ======================
# FINAL IMAGE (PHP)
# ======================
FROM php:8.3-cli
WORKDIR /app

# System deps + PHP extensions
RUN apt-get update && apt-get install -y \
  unzip git libpng-dev libjpeg-dev libfreetype6-dev libzip-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install gd pdo_mysql zip \
  && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY . .

# Copy vendor & built assets
COPY --from=vendor /app/vendor /app/vendor
COPY --from=frontend /app/public/build /app/public/build

# Ensure dirs & permissions
RUN mkdir -p storage bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache

# Create storage symlink (needed for /storage/* URLs)
RUN php artisan storage:link || true

# Cache (optional, don't fail build if env not ready)
RUN php artisan config:cache || true \
 && php artisan route:cache || true \
 && php artisan view:cache  || true

EXPOSE 8080

# Run migrations on boot (optional) then serve
CMD php artisan migrate --force || true && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
