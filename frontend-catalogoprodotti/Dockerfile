# Usa un'immagine base ufficiale di Node.js
FROM node:18

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice dell'app
COPY . .

# Compila l'app per la produzione
RUN npm run build

# Usa un'immagine Nginx per servire il frontend
FROM nginx:alpine
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Esponi la porta 80 per Nginx
EXPOSE 80

# Comando per avviare Nginx
CMD ["nginx", "-g", "daemon off;"]