# ======================
# FRONTEND BUILD
# ======================
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ======================
# BACKEND DEPENDENCIES
# ======================
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
  --no-dev \
  --prefer-dist \
  --no-interaction \
  --no-scripts \
  --optimize-autoloader \
  --ignore-platform-req=ext-gd \
  --ignore-platform-req=php

# ======================
# FINAL IMAGE
# ======================
FROM php:8.3-cli
WORKDIR /app

RUN apt-get update && apt-get install -y \
  unzip git libpng-dev libjpeg-dev libfreetype6-dev libzip-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install gd pdo_mysql zip \
  && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY . .

# Copy vendor & assets
COPY --from=vendor /app/vendor /app/vendor
COPY --from=frontend /app/public/build /app/public/build

# Permissions
RUN mkdir -p storage bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache

# Cache Laravel
RUN php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear || true

EXPOSE 8080
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
