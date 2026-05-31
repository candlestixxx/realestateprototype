# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
# Ignore scripts to prevent postinstall from attempting to access uncopied server/ folder
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# Stage 2: Build the backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/dist ./dist

# Copy backend dependencies and build
COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server/dist ./server/dist

# Install production dependencies for backend
WORKDIR /app/server
RUN npm ci --omit=dev

# Expose the API and static server port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
