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

        // http://localhost:3000/reviews?sort=rating&order=desc&genre=RPG

        app.get('/reviews', async (req, res) => {
            
            const reviews = client.db("game_review").collection("reviews"); 
            
            const label = req.query.sort || "title";
            const order = req.query.order === "asc" ? 1 : -1 || 1;
            const genre = req.query.genre || null;

            const query = { genre: genre || { $exists: true } };
            const options = {
              sort: { [label]: order },
              projection: { game_cover: 1, genre: 1, publishing_year: 1, title: 1 },
            };
            
            const cursor = reviews.find(query, options);

            const result = await cursor.toArray();
            
            if (result.length === 0) {
                res.send("no data found");
            } else {
                res.json(result);
            }

        })

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