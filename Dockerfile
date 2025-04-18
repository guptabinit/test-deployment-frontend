# Stage 1: Install dependencies
FROM node:20.16.0 AS deps
WORKDIR /app
# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the application
FROM node:20.16.0 AS builder
WORKDIR /app
# Copy node_modules from deps stage and the rest of the source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the Next.js application
RUN npm run build

# Stage 3: Run the application in production
FROM node:20.16.0 AS runner
WORKDIR /app
# Set production environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:11000

# Copy built assets and production dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port on which your app will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
