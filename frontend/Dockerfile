# Stage 1: Build React Application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set dynamic API URL env at build time (defaults to localhost)
ARG VITE_API_URL=http://localhost:5000/api/auth
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve built assets with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx server block configuration to support React Router SPA routes
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
