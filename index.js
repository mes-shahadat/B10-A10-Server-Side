const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.uzgf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

async function run() {
    try {

        // http://localhost:3000/reviews?sort=rating&order=desc&genre=RPG
        const reviews = client.db("game_review").collection("reviews");

        app.get('/reviews', async (req, res) => {

            const label = req.query.sort || "title";
            const order = req.query.order === "asc" ? 1 : -1 || 1;
            const genre = req.query.genre || null;

            const query = { genre: genre || { $exists: true } };
            const options = {
                sort: { [label]: order },
                projection: { game_cover: 1, genre: 1, platforms: 1, publishing_year: 1, title: 1 },
            };

            const cursor = reviews.find(query, options);

            const result = await cursor.toArray();

            if (result.length === 0) {
                res.json([]);
            } else {
                res.json(result);
            }

        })

        app.get('/genres', async (req, res) => {

            const result = await reviews.distinct("genre");

            res.json(result);

        })

        app.get('/review/:id', async (req, res) => {

            try {

                const query = { _id: new ObjectId(req.params.id) };
                const result = await reviews.findOne(query);
                res.json(result);

            } catch (err) { res.json(null) }

        })

        app.get('/myReviews/:email', async (req, res) => {

            const query = { user_email: req.params.email };
            const options = {
                projection: { game_cover: 1, genre: 1, platforms: 1, review_description: 1, rating: 1, title: 1 },
            };

            const cursor = reviews.find(query, options);

            const result = await cursor.toArray();

            if (result.length === 0) {
                res.json([]);
            } else {
                res.json(result);
            }

        })

        app.get('/updateReview/:id', async (req, res) => {

            try {

                const query = { _id: new ObjectId(req.params.id) };
                const result = await reviews.findOne(query);
                res.json(result);

            } catch (err) { res.json(null) }

        })

        app.put('/updateReview/:id', async (req, res) => {

            let reviewer = req.body.editor_email;
            delete req.body.editor_email;

            try {

                const filter = { _id: new ObjectId(req.params.id) };

                const doc = await reviews.findOne(filter, {
                    projection: { user_email: 1 }
                });

                if (doc.user_email === reviewer) {

                    const updateDoc = {
                        $set: {
                            ...req.body
                        },
                    };

                    const result = await reviews.updateOne(filter, updateDoc);

                    res.json(result);

                } else { res.json({ "error": "this is not your post" }) }

            } catch (err) { res.json(null) }

        })

        app.post('/addReview', async (req, res) => {

            const result = await reviews.insertOne(req.body);

            res.json(result);

        })


        app.delete('/review/:id', async (req, res) => {

            let reviewer = req.body.editor_email;
            delete req.body.editor_email;
            
            try {

                const query = { _id: new ObjectId(req.params.id) };

                const doc = await reviews.findOne(query, {
                    projection: { user_email: 1 }
                });

                if (!reviewer) { return res.json({"error": "editor email missing"}) }

                if (doc.user_email === reviewer) {

                    const result = await reviews.deleteOne(query);
                    
                    res.json(result);
                    
                } else { res.json({ "error": "this is not your post" }) }

            } catch (err) { res.json(null) }

        })

    } finally {
        console.log("finally");
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("working")
})

app.listen(port, () => {
    console.log(`port is running on ${port}`)
})