# Stage 1: Install dependencies
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# Stage 2: Build
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 1100+ MDX files require extra memory for Astro build
ENV NODE_OPTIONS="--max-old-space-size=12288"

RUN pnpm run build


# Stage 3: Serve static files with nginx
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA-like fallback for 404
RUN printf 'server {\n  listen 4010;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/index.html $uri.html /404.html;\n  }\n  error_page 404 /404.html;\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 4010

CMD ["nginx", "-g", "daemon off;"]
