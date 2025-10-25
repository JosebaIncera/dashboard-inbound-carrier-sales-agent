# Use official Node.js runtime as base image
FROM node:20-alpine AS base
WORKDIR /app

# Install OS deps
RUN apk add --no-cache libc6-compat

# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of your source code
COPY . .

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

# Copy dependencies and built app from build stage
COPY --from=base --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Railway sets $PORT automatically
EXPOSE 8080
ENV PORT=8080

# Start Next.js
CMD ["npm", "start"]
