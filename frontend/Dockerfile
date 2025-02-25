FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN  npm i --legacy-peer-deps
COPY . .
RUN npm run build --prod --verbose

FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8082
