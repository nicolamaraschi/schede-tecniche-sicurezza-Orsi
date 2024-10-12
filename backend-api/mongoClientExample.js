const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://nicolamaraschi01:marase@cluster0.8odxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connetti il client al server
    await client.connect();
    
    // Specifica il database a cui vuoi connetterti
    const database = client.db("test"); // Cambia "test" con "egstore" se necessario

    // Invia un ping per confermare una connessione riuscita
    await database.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // Esegui ulteriori operazioni qui, se necessario

  } finally {
    // Assicura che il client si chiuda al termine
    await client.close();
  }
}

run().catch(console.dir);
