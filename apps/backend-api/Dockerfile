# syntax=docker/dockerfile:1.7
FROM node:24-bookworm-slim AS dependencies
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/backend-api/package.json apps/backend-api/package.json
COPY apps/frontend-dashboard/package.json apps/frontend-dashboard/package.json
COPY apps/mobile/package.json apps/mobile/package.json
RUN npm ci

FROM dependencies AS build
COPY tsconfig.base.json ./
COPY apps/backend-api apps/backend-api
RUN npm run backend:build

FROM dependencies AS migrator
ENV NODE_ENV=production
COPY tsconfig.base.json ./
COPY apps/backend-api apps/backend-api
CMD ["npm", "run", "backend:db:migrate"]

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app
COPY --from=dependencies /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/backend-api/dist ./dist
COPY apps/backend-api/package.json ./package.json
RUN npm prune --omit=dev && mkdir -p /data/uploads && chown -R node:node /app /data
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
