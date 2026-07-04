# Multi-stage build for RepoLens (Client & Server)

# Stage 1: Build client
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production environment
FROM node:18-alpine
WORKDIR /app

# Copy server dependencies & files
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server/ ./server/

# Copy built frontend client assets to server public/static if applicable
COPY --from=client-builder /app/client/dist ./server/public

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "server/index.js"]
