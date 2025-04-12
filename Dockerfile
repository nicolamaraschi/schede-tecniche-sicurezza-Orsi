FROM ubuntu:latest

# Installa Docker Compose e altre dipendenze necessarie
RUN apt-get update && \
    apt-get install -y docker.io docker-compose curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia tutti i file necessari
COPY . .

# Comando di avvio
CMD ["docker-compose", "up", "-d"]