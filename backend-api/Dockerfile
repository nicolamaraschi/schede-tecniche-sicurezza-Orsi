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

# Esponi la porta dell'API (ad esempio 5000)
EXPOSE 5002

# Comando per avviare l'app
CMD ["node", "app.js"]
 