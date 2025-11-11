# ---------- Stage 1: Build Angular ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source and build
COPY . .
RUN npx ng build --configuration production

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Clean existing content
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output (note: 'browser' subfolder)
COPY --from=build /app/dist/petmanagement/browser /usr/share/nginx/html

# Add custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

