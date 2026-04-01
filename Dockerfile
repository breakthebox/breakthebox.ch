# ═══════════════════════════════════════════════════════════
# Multi-stage Dockerfile — SvelteKit Production Build
# ═══════════════════════════════════════════════════════════

# ─── Stage 1: Install dependencies ───
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ─── Stage 2: Build ───
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run paraglide:compile && npm run build

# ─── Stage 3: Production ───
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

# Copy migration files + migration script
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/scripts ./scripts

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "build"]
