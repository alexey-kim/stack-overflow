# Stage 1: Build the application
FROM node:22 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (including dev dependencies for building)
RUN npm install

# Copy the rest of application code
COPY . .

# Build application code
RUN npm run build

# Stage 2: Create a smaller runtime image
FROM node:22 AS runtime

# Set the working directory in the final image
WORKDIR /usr/src/app

# Copy only the build files from the builder stage
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port that the application runs on
EXPOSE 3002

# Run application
CMD ["node", "./build/server.js"]
