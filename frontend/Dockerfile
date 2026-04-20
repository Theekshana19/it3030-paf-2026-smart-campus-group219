# ---- Stage 1: Build with Node ----
FROM node:20-alpine AS build
WORKDIR /app

# cache dependencies first
COPY package.json package-lock.json* ./
RUN npm install

# copy source and build
COPY . .
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
