const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://surajbr2011_db_user:Suraj%40123@cluster0.6pc7yzv.mongodb.net/exotica_agonda?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
    const client = new MongoClient(uri);
    try {
        console.log("Connecting to MongoDB Atlas...");
        await client.connect();
        console.log("Connected successfully!");
        const db = client.db("exotica_agonda");
        const list = await db.collections();
        console.log("Collections:", list.map(c => c.collectionName));
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await client.close();
    }
}

run();
