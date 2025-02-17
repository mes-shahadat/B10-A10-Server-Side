const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json())


const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
    try {

        const reviews = client.db("game_review").collection("reviews");

        app.get('/reviews', async (req, res) => {

            const label = req.query.sort == "year" ? "publishing_year" : req.query.sort || "title";
            const order = req.query.order === "asc" ? 1 : req.query.order === "desc" ? -1 : 1 || 1;
            const genre = req.query.genre || null;
            const Maximum = parseInt(req.query.limit) || 0;
            const skip = parseInt(req.query.skip) || 0;

            const query = { genre: genre || { $exists: true } };
            const options = {
                sort: { [label]: order },
                skip: skip,
                limit: Maximum,
                projection: { game_cover: 1, genre: 1, platforms: 1, publishing_year: 1, title: 1, review_description: 1, rating: 1 },
            };

            const cursor = reviews.find(query, options);

            const result = await cursor.toArray();

            if (result.length === 0) {
                res.json([]);
            } else {
                res.json(result);
            }

        })

        app.get('/reviews-count', async (req, res) => {

            const label = req.query.sort || "title";
            const order = req.query.order === "asc" ? 1 : -1 || 1;
            const genre = req.query.genre || null;

            const query = { genre: genre || { $exists: true } };
            const options = {
                sort: { [label]: order },
                projection: { game_cover: 1, genre: 1, platforms: 1, publishing_year: 1, title: 1, review_description: 1, rating: 1 },
            };

            const result = await reviews.countDocuments(query, options);

            res.json({ "count": result })

        })

        app.get('/new-release', async (req, res) => {

            const Maximum = parseInt(req.query.limit) || 0;

            const query = { publishing_year: { $exists: true } };
            const options = {
                sort: { publishing_year: -1 },
                limit: Maximum,
                projection: { game_cover: 1, genre: 1, platforms: 1, publishing_year: 1, title: 1, rating: 1 },
            };

            const cursor = reviews.find(query, options);

            const result = await cursor.toArray();

            if (result.length === 0) {
                res.json([]);
            } else {
                res.json(result);
            }

        })

        app.get('/recommended', async (req, res) => {

            const Maximum = parseInt(req.query.limit) || 0;

            const query = { is_recommended: true };
            const options = {
                sort: { title: 1 },
                limit: Maximum,
                projection: { game_cover: 1, genre: 1, platforms: 1, publishing_year: 1, title: 1, rating: 1, is_recommended: 1 },
            };

            const cursor = reviews.find(query, options);

            const result = await cursor.toArray();

            if (result.length === 0) {
                res.json([]);
            } else {
                res.json(result);
            }

        })

        app.get('/highest-rated', async (req, res) => {

            const Maximum = parseInt(req.query.limit) || 0;

            const query = { rating: { $exists: true } };
            const options = {
                sort: { rating: -1 },
                limit: Maximum,
                projection: { game_cover: 1, genre: 1, platforms: 1, tags: 1, title: 1, rating: 1 },
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

        app.get('/tags', async (req, res) => {

            const result = await reviews.distinct("tags");

            res.json(result);

        })

        app.get('/platforms', async (req, res) => {

            const result = await reviews.distinct("platforms");

            res.json(result);

        })

        app.get('/banners', async (req, res) => {

            const reviews = client.db("game_review").collection("bannerSlides");

            const cursor = reviews.find();

            const result = await cursor.toArray();

            if (result.length === 0) {
                res.json([]);
            } else {
                res.json(result);
            }

        })

        app.get('/review/:id', async (req, res) => {

            try {

                const query = { _id: new ObjectId(req.params.id) };
                const result = await reviews.findOne(query);
                res.json(result);

            } catch (err) { res.json(null) }

        })

        app.get('/my-reviews/:email', async (req, res) => {

            const query = { user_email: req.params.email };
            const options = {
                projection: { game_cover: 1, platforms: 1, publishing_year: 1, review_description: 1, rating: 1, title: 1, tags: 1 },
            };

            const cursor = reviews.find(query, options);

            const result = await cursor.toArray();

            if (result.length === 0) {
                res.json([]);
            } else {
                res.json(result);
            }

        })

        app.get('/update-review/:id', async (req, res) => {

            try {

                const query = { _id: new ObjectId(req.params.id) };
                const result = await reviews.findOne(query);
                res.json(result);

            } catch (err) { res.json(null) }

        })

        app.post('/my-saved-watchlist', async (req, res) => {

            const reviews = client.db("game_review").collection("myWatchlist");

            try {

                const pipeline = [
                    { $match: { user_email: req.body.user_email } },
                    {
                        $lookup: {
                            from: "reviews",
                            localField: "favorites.post_id",
                            foreignField: "_id",
                            as: "doc"
                        }
                    },
                    { $unwind: "$doc" },
                    { $replaceRoot: { newRoot: "$doc" } }
                ];


                const aggregationResult = reviews.aggregate(pipeline);
                const result = await aggregationResult.toArray();
                res.json(result);

            } catch (err) { res.json({ "err": err.message }) }

        })

        app.put('/update-review/:id', async (req, res) => {

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

        app.post('/add-banner', async (req, res) => {

            const reviews = client.db("game_review").collection("bannerSlides");

            const result = await reviews.insertOne(req.body);

            res.json(result);

        })

        app.post('/add-review', async (req, res) => {

            if (req.body.user_email) {
                
                const result = await reviews.insertOne(req.body);
                res.json(result);

            } else {
                res.json({"error": "don't know the user"})
            }

        })

        app.post('/my-watchlist', async (req, res) => {

            req.body.favorites[0].post_id = new ObjectId(req.body.favorites[0].post_id);

            const reviews = client.db("game_review").collection("myWatchlist");

            try {

                const filter = { user_email: req.body.user_email };

                const doc = await reviews.findOne(filter, {
                    projection: { user_email: 1 }
                });

                if (doc?.user_email) {

                    const updateDoc = {
                        $addToSet: {
                            "favorites": req.body.favorites[0]
                        }
                    }

                    const result = await reviews.updateOne(filter, updateDoc);

                    res.json(result);

                } else {

                    const result = await reviews.insertOne(req.body);
                    res.json(result);
                }

            } catch (err) { res.json(null) }

        })


        app.delete('/review/:id', async (req, res) => {

            let reviewer = req.body.editor_email;
            delete req.body.editor_email;

            try {

                const query = { _id: new ObjectId(req.params.id) };

                const doc = await reviews.findOne(query, {
                    projection: { user_email: 1 }
                });

                if (!reviewer) { return res.json({ "error": "editor email missing" }) }

                if (doc.user_email === reviewer) {

                    const result = await reviews.deleteOne(query);

                    res.json(result);

                } else { res.json({ "error": "this is not your post" }) }

            } catch (err) { res.json(null) }

        })

        app.delete('/my-watchlist/:id', async (req, res) => {

            req.params.id = new ObjectId(req.params.id);
            let reviewer = req.body.editor_email;
            delete req.body.editor_email;


            const reviews = client.db("game_review").collection("myWatchlist");


            try {

                const query = { user_email: reviewer };

                if (!reviewer) { return res.json({ "error": "editor email missing" }) }

                const result = await reviews.updateOne(query, { $pull: { favorites: { post_id: req.params.id } } })

                res.json(result);

            } catch (err) { res.json(null) }

        })

    } finally {

        console.log("finally");
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("server is running")
})

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}/`)
})