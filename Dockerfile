FROM node:alpine3.18 AS build
WORKDIR /app

COPY package.json .

# Set environment variables from GitHub secrets
ARG VITE_BASE_API
ARG VITE_GEMINI_API_KEY
ENV VITE_BASE_API=${VITE_BASE_API}
ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}

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
