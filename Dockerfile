FROM ubuntu:latest

# Installa dipendenze di sistema
RUN apt-get update && \
    apt-get install -y python3-pip python3-setuptools docker.io docker-compose curl && \
    rm -rf /var/lib/apt/lists/*

# Installa distutils usando pip
RUN pip3 install setuptools

WORKDIR /app

# Copia tutti i file necessari
COPY . .

# Imposta il comando di avvio
CMD ["docker-compose", "up", "-d"]