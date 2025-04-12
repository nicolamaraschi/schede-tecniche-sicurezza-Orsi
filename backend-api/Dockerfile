FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Ensure uploads directory exists and is writable
RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 5002

CMD ["node", "app.js"]