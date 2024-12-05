const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.uzgf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

async function run() {
    try {

        
        app.post('/reviews', async (req, res) => {
            
            const reviews = client.db("game_review").collection("reviews"); 
            
            const result = await reviews.insertOne(req.body);
            
            res.json(result);

        })
    } finally {
        // Close the MongoDB client connection
        //    await client.close();
        console.log("finally..")
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("working")
})

app.listen(port, () => {
    console.log(`port is running on ${port}`)
})