### Progetto: Backend API per la Gestione di Prodotti e Documenti

Questo progetto consiste in un'API REST per la gestione di prodotti e documenti, che include funzionalità di registrazione e autenticazione utenti tramite JWT. I prodotti possono avere associati documenti, come file PDF, che possono essere caricati e recuperati dall'API. Il database utilizzato è MongoDB e la connessione avviene tramite MongoDB Atlas.

### Funzionalità Principali

- **Registrazione Utenti**: Creazione di nuovi utenti con username e password.
- **Login Utenti**: Autenticazione degli utenti registrati, con generazione di un token JWT.
- **Gestione Prodotti**: Creazione, visualizzazione e gestione di prodotti.
- **Gestione Documenti**: Caricamento e recupero di documenti associati a un prodotto.
- **Protezione delle Rotte**: Le rotte sensibili sono protette da autenticazione JWT.

### Tecnologie Utilizzate

- **Node.js**: Piattaforma server-side per eseguire JavaScript.
- **Express.js**: Framework per Node.js utilizzato per creare le API REST.
- **MongoDB Atlas**: Database NoSQL cloud-based.
- **Mongoose**: Libreria ODM per interfacciarsi con MongoDB.
- **JSON Web Tokens (JWT)**: Per l'autenticazione degli utenti.
- **Multer**: Middleware per la gestione dell'upload di file.

### Installazione

1. **Clona il Repository**
   ```bash
   git clone https://github.com/tuo/repo.git
   cd backend-api
   ```

2. **Installa le Dipendenze**
   ```bash
   npm install
   ```


4. **Imposta MongoDB Atlas**
   Vai alla sezione **Network Access** del tuo account MongoDB Atlas e aggiungi un IP whitelist di `0.0.0.0/0` per permettere l'accesso da qualsiasi indirizzo IP. A volte questa impostazione potrebbe disattivarsi, quindi assicurati di ricontrollarla se la connessione al database smette di funzionare.

### Avvio del Server

Avvia il server Node.js con il seguente comando:

```bash
node app.js
```

Se tutto è stato configurato correttamente, vedrai messaggi simili ai seguenti:

```bash
Server running on port 5002
Connected to MongoDB
```

### Rotte API

Di seguito una lista delle principali API disponibili per il testing:

#### Autenticazione

1. **Registrazione**
   - **URL**: `http://localhost:5002/api/auth/register`
   - **Metodo**: `POST`
   - **Body (JSON)**:
     ```json
     {
       "username": "exampleUser",
       "password": "examplePassword"
     }
     ```
   - **Risposta**: `201 Created`  
     ```json
     {
       "message": "User registered successfully"
     }
     ```

2. **Login**
   - **URL**: `http://localhost:5002/api/auth/login`
   - **Metodo**: `POST`
   - **Body (JSON)**:
     ```json
     {
       "username": "exampleUser",
       "password": "examplePassword"
     }
     ```
   - **Risposta**: `200 OK`  
     ```json
     {
       "token": "JWT_TOKEN"
     }
     ```

#### Prodotti

1. **Crea un Prodotto**
   - **URL**: `http://localhost:5002/api/products`
   - **Metodo**: `POST`
   - **Body (JSON)**:
     ```json
     {
       "name": "Product Name",
       "description": "Product Description"
     }
     ```
   - **Risposta**: `201 Created`  
     ```json
     {
       "_id": "PRODUCT_ID",
       "name": "Product Name",
       "description": "Product Description"
     }
     ```

2. **Ottieni tutti i Prodotti**
   - **URL**: `http://localhost:5002/api/products`
   - **Metodo**: `GET`
   - **Risposta**: `200 OK`  
     ```json
     [
       {
         "_id": "PRODUCT_ID",
         "name": "Product Name",
         "description": "Product Description"
       }
     ]
     ```

3. **Ottieni un Prodotto per ID**
   - **URL**: `http://localhost:5002/api/products/:productId`
   - **Metodo**: `GET`
   - **Risposta**: `200 OK`  
     ```json
     {
       "_id": "PRODUCT_ID",
       "name": "Product Name",
       "description": "Product Description"
     }
     ```

#### Documenti

1. **Carica un Documento**
   - **URL**: `http://localhost:5002/api/documents/upload`
   - **Metodo**: `POST`
   - **Autenticazione**: Bearer Token (JWT)
   - **Body (Form-Data)**:
     - **Key**: `productId`, **Value**: `64fcb6f7b19c8c0011f69a34` (Esempio di `productId`)
     - **Key**: `type`, **Value**: `pdf`
     - **Key**: `file`, **Value**: (Seleziona il file PDF dal tuo computer)

   - **Risposta**: `201 Created`  
     ```json
     {
       "message": "Document uploaded successfully",
       "document": {
         "_id": "DOCUMENT_ID",
         "productId": "PRODUCT_ID",
         "type": "pdf",
         "fileUrl": "/path/to/file.pdf"
       }
     }
     ```

2. **Ottieni tutti i Documenti per un Prodotto**
   - **URL**: `http://localhost:5002/api/documents/:productId`
   - **Metodo**: `GET`
   - **Autenticazione**: Bearer Token (JWT)
   - **Risposta**: `200 OK`  
     ```json
     [
       {
         "_id": "DOCUMENT_ID",
         "productId": "PRODUCT_ID",
         "type": "pdf",
         "fileUrl": "/path/to/file.pdf"
       }
     ]
     ```

### Note Importanti

1. **Connessione a MongoDB Atlas**: Verifica sempre che il tuo IP sia whitelistato nella sezione **Network Access** di MongoDB Atlas. Aggiungi `0.0.0.0/0` per permettere l'accesso da qualsiasi IP, e se riscontri problemi di connessione al database, assicurati che questa impostazione sia ancora attiva.
   
2. **JWT e Sicurezza**: Le rotte protette richiedono un token JWT valido. Assicurati di includere il token nell'header `Authorization` come `Bearer Token` nelle richieste alle API protette.

3. **Middleware di Upload**: L'upload dei documenti viene gestito tramite `Multer`, quindi assicurati che il campo `file` nel body della richiesta sia impostato correttamente come file.

### Testing dell'API con Postman

- Puoi utilizzare **Postman** per testare facilmente tutte le rotte e inviare richieste HTTP. Ricordati di includere i corretti header e token JWT dove necessario.
