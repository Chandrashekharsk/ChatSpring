#stage1

FROM node:20 as build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

#stage2
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

