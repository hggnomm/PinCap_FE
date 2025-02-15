# Step 1: Build Vite App
FROM node:alpine3.18 as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . . 
RUN npm run build

FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist . 
EXPOSE 80 

# Chạy Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
