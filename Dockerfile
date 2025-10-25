# Use official Node.js runtime as base image
FROM node:20-alpine AS base
WORKDIR /app
# Install OS deps
RUN apk add --no-cache libc6-compat
# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Builder stage ----------
FROM base AS builder
WORKDIR /app
COPY . .

# Accept build args for environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set them as environment variables for the build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build the Next.js app
RUN npm run build

# ---------- Production image ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy dependencies and built app from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Railway sets $PORT automatically
EXPOSE 8080
ENV PORT=8080

# Start Next.js
CMD ["npm", "start"]