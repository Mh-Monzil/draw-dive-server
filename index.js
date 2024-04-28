const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j6yhdqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("paintingDB");
    const itemCollection = database.collection("itemCollection");

    app.get('/craft_items', async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/craft_items/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await itemCollection.findOne(query);
      res.send(result);
    })

    app.get('/view_details/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await itemCollection.findOne(query);
      res.send(result);
    })

    app.get('/craft_items/:email', async (req, res) => {
      const email = req.params.email;
      const query = {user_email: email};
      const cursor = itemCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/craft_items', async (req, res) => {
        const item = req.body;
        console.log(item);
        const result = await itemCollection.insertOne(item)
        res.send(result);
    })

    app.put("/craft_items/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedInfo = req.body;

      const item = {
        $set: {
          item_name: updatedInfo.item_name,
          category_name: updatedInfo.category_name,
          customization: updatedInfo.customization,
          photo: updatedInfo.photo,
          price: updatedInfo.price,
          processing_time: updatedInfo.processing_time,
          rating: updatedInfo.rating,
          short_description: updatedInfo.price,
          stock_status: updatedInfo.stock_status,
        }
      }
      
      const result = await itemCollection.updateOne(filter, item, options);
      res.json(result);
    })

    app.delete('/craft_items/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    })
    

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send("welcome to drawing and painting");
})

app.listen(port);