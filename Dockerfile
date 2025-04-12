FROM ubuntu:latest

# Installa dipendenze Python e Docker
RUN apt-get update && \
    apt-get install -y python3-distutils docker.io docker-compose curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia tutti i file necessari
COPY . .

# Imposta il comando di avvio
CMD ["docker-compose", "up", "-d"]