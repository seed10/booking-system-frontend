####
# Stage 1: Build the Angular application
####
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

####
# Stage 2: Serve the application with Nginx
####
FROM nginx:alpine

# Copy the built application from the build stage
COPY --from=build /app/dist/booking-system/browser /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
