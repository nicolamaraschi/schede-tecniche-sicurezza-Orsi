FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Assicurati che la directory uploads esista
RUN mkdir -p uploads

EXPOSE 5002

CMD ["node", "app.js"]