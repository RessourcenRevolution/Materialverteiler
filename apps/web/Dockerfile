FROM node:24.4.0-alpine3.22 AS base

WORKDIR /app

# build astro
FROM base as build
COPY . .
RUN NODE_ENV=development npm ci --workspace=apps/web
RUN npm run build --workspace=apps/web

# start astro
FROM base as runtime
COPY --from=build /app/apps/web/dist /app/dist
COPY --from=build /app/apps/web/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules
ENV HOST=0.0.0.0
EXPOSE 3000
CMD node ./dist/server/entry.mjs --host=0.0.0.0