FROM node:24.4.0-alpine3.22 AS base 

RUN apk add --no-cache openssl

WORKDIR /app

FROM base AS build

COPY package.json package-lock.json .
COPY apps/keystone /app/apps/keystone
RUN NODE_ENV=development npm ci --workspace=apps/keystone
ARG WEB_APP_BASE_URL
RUN npm run build --workspace=apps/keystone

ENV HOST=0.0.0.0
ENV PORT=3002
EXPOSE 3002
CMD ["npm", "run", "start", "--workspace=apps/keystone"]


