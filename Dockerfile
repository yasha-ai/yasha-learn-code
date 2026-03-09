FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Increase memory limit for build (16GB for 1100+ pages)
ENV NODE_OPTIONS="--max-old-space-size=16384"
RUN pnpm run build

EXPOSE 4010

CMD ["pnpm", "start"]
