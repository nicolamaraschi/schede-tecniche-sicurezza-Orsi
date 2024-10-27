Here's a suggested structure for your `README.md` file that includes information about creating Docker images, running them, and details about your project structure.

```markdown
# Progetto API REST per la Gestione di Prodotti

## Descrizione
Questo progetto consiste in un'API REST per la gestione di prodotti e documenti. Include funzionalità di registrazione e autenticazione utenti tramite JWT. I prodotti possono avere associati documenti, come file PDF, che possono essere caricati e recuperati dall'API. Il database utilizzato è MongoDB e la connessione avviene tramite MongoDB Atlas.

## Struttura del Progetto
```
/schede-tecniche-sicurezza-Orsi
│
├── backend-api
│   ├── Dockerfile
│   ├── package.json
│   ├── app.js
│   └── ... (altri file del backend)
│
├── frontend-catalogoprodotti
│   ├── Dockerfile
│   ├── package.json
│   └── ... (altri file del frontend)
│
├── frontend-gestoreprodotti
│   ├── Dockerfile
│   ├── package.json
│   └── ... (altri file del frontend)
│
├── docker-compose.yml
└── README.md
```

## Docker
### Prerequisiti
Assicurati di avere installato Docker e Docker Compose. Puoi scaricarli da [qui](https://docs.docker.com/get-docker/) e [qui](https://docs.docker.com/compose/install/).

### Creazione delle Immagini Docker
Per costruire le immagini Docker per il tuo progetto, esegui il seguente comando nella directory principale del progetto:

```bash
docker-compose build
```

### Avvio dei Contenitori
Per avviare i contenitori Docker, utilizza il seguente comando:

```bash
docker-compose up
```

### Elimina Immagini Docker
Se hai bisogno di eliminare immagini Docker non utilizzate per liberare spazio, puoi utilizzare il seguente comando:

```bash
docker rmi $(docker images -f "dangling=true")
```

In caso di immagini specifiche, puoi identificare le immagini e rimuoverle utilizzando:

```bash
docker rmi <image_id>
```

### Aggiornamento delle Immagini
Ogni volta che apporti modifiche al codice sorgente, dovrai ricostruire le immagini Docker per riflettere tali cambiamenti. Puoi farlo eseguendo nuovamente il comando di build.

## Note
- Assicurati di avere tutte le dipendenze installate nel file `package.json` per il backend (es. `express`, `mongoose`) e nel file `package.json` per i front-end.
- Controlla il tuo Dockerfile per garantire che le istruzioni siano corrette e ottimizzate.

## Contribuzione
Se desideri contribuire a questo progetto, sentiti libero di inviare una pull request o aprire un'issue per discussioni.
```

Feel free to customize any part of the README to better fit your project's specifics!