# Build the React app.
FROM node:20-slim AS build
WORKDIR /app

# Copied on its own so the dependency layer stays cached across code changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# CRA treats lint warnings as errors when CI is set.
ENV CI=false
RUN npm run build

# Serve the static build with nginx, which also proxies /api to the backend.
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
