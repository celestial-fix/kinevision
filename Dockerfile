# Build Stage for Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Final Stage
FROM python:3.11-slim

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Setup Backend
WORKDIR /app
COPY backend/pyproject.toml backend/uv.lock ./
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
RUN uv sync --frozen --no-cache --system

COPY backend/ .

# Setup Frontend (Copy built assets)
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Setup Nginx Config
COPY nginx.conf /etc/nginx/nginx.conf

# Setup Start Script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Environment Variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 80

CMD ["/start.sh"]
