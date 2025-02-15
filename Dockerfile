FROM node:alpine3.18 AS build
WORKDIR /app

COPY package.json .

# Set environment variables from GitHub secrets
ARG VITE_BASE_API
ARG VITE_GEMINI_API_KEY
ENV VITE_BASE_API=${VITE_BASE_API}
ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist . 

# Copy nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 
ENTRYPOINT ["nginx", "-g", "daemon off;"]
