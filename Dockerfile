FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Increase memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN pnpm run build

EXPOSE 4010

CMD ["pnpm", "start"]
