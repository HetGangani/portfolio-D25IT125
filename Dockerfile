# ==========================================
# Stage 1: Build stage
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Accept VITE_API_URL build argument (defaults to host port 5001 for Docker deployment)
ARG VITE_API_URL=http://localhost:5001
ENV VITE_API_URL=$VITE_API_URL

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies required for Vite build)
RUN npm ci

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# ==========================================
# Stage 2: Production Nginx stage
# ==========================================
FROM nginx:alpine

# Copy custom Nginx configuration with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

