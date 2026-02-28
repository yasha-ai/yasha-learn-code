FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Increase memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN npm run build

EXPOSE 4010

CMD ["npm", "start"]