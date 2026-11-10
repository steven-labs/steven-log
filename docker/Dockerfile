FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG PUBLIC_GISCUS_REPO
ARG PUBLIC_GISCUS_REPO_ID
ARG PUBLIC_GISCUS_CATEGORY
ARG PUBLIC_GISCUS_CATEGORY_ID
RUN npm run build
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=101:101 /app/dist /usr/share/nginx/html
USER 101
EXPOSE 8080
