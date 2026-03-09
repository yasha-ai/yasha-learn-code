# Stage 1: Install dependencies
FROM node:20-alpine AS deps

# Install git (required by nextra for last-modified timestamps)
RUN apk add --no-cache git

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# Stage 2: Build
FROM node:20-alpine AS builder

RUN apk add --no-cache git
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Init a dummy git repo so nextra doesn't warn and fail
RUN git config --global user.email "build@docker.local" && \
    git config --global user.name "Docker Build" && \
    git init && \
    git add -A && \
    git commit -m "build snapshot" --quiet

ENV NEXT_TELEMETRY_DISABLED=1
# 1200+ MDX files require ~9-10GB for webpack compilation
ENV NODE_OPTIONS="--max-old-space-size=12288"

RUN pnpm run build


# Stage 3: Production runner (minimal image)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4010
ENV HOSTNAME="0.0.0.0"

# standalone output contains everything needed to run
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 4010

CMD ["node", "server.js"]
