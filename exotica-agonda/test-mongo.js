const { MongoClient } = require('mongodb');

const uri = "mongodb://ac-haz5dlk-shard-00-00.6pc7yzv.mongodb.net:27017,ac-haz5dlk-shard-00-01.6pc7yzv.mongodb.net:27017,ac-haz5dlk-shard-00-02.6pc7yzv.mongodb.net:27017/exotica_agonda?ssl=true&replicaSet=atlas-toszeu-shard-0&authSource=admin&retryWrites=true&connectTimeoutMS=30000&serverSelectionTimeoutMS=30000&tlsInsecure=true";

async function run() {
    const client = new MongoClient(uri);
    try {
        console.log("Connecting to MongoDB Atlas via Native Driver...");
        await client.connect();
        console.log("SUCCESS! Connected to MongoDB.");
        
        const db = client.db();
        const collections = await db.listCollections().toArray();
        console.log("Collections in database:", collections.map(c => c.name));
        
    } catch (err) {
        console.error("FAILED to connect via Native Driver:");
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
