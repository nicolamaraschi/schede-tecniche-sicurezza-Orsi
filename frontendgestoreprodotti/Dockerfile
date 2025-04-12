# Fase di build
FROM node:18 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Fase di produzione
FROM nginx:alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Configurazione per il routing React
RUN echo '                                                   \
server {                                                    \
    listen 80;                                              \
    location / {                                            \
        root /usr/share/nginx/html;                         \
        index index.html index.htm;                         \
        try_files $uri $uri/ /index.html;                   \
    }                                                       \
    location /api {                                         \
        proxy_pass http://backend-api:5002/api;             \
        proxy_http_version 1.1;                             \
        proxy_set_header Upgrade $http_upgrade;             \
        proxy_set_header Connection "upgrade";              \
        proxy_set_header Host $host;                        \
        proxy_cache_bypass $http_upgrade;                   \
    }                                                       \
    location /uploads {                                     \
        proxy_pass http://backend-api:5002/uploads;         \
    }                                                       \
}                                                           \
' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]