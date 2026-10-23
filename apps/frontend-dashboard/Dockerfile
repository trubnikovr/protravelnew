# syntax=docker/dockerfile:1.7
FROM node:24-bookworm-slim AS build
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/backend-api/package.json apps/backend-api/package.json
COPY apps/frontend-dashboard/package.json apps/frontend-dashboard/package.json
COPY apps/mobile/package.json apps/mobile/package.json
RUN npm ci
COPY tsconfig.base.json ./
COPY apps/frontend-dashboard apps/frontend-dashboard
RUN npm run dashboard:build

FROM nginxinc/nginx-unprivileged:1.28-alpine
COPY apps/frontend-dashboard/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/frontend-dashboard/dist /usr/share/nginx/html
EXPOSE 8080
