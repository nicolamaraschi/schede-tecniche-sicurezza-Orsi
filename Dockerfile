FROM docker/compose:latest

WORKDIR /app

COPY . .

CMD ["up", "-d"]