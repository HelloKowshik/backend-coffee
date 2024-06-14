const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zg5lt79.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


app.use(cors({
    origin:['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/', (req, res) => {
    res.send('Coffee Script is Running....');
});



async function run() {
  try {
    await client.connect();
    const coffeeCollection = client.db('coffeeDB').collection('coffeeStore');
    const userCollection = client.db('coffeeDB').collection('users');

    app.get('/coffee', async (req, res) => {
        const coffees = coffeeCollection.find();
        const result = await coffees.toArray();
        res.send(result);
    });

    app.get('/show-coffee/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result);
    });

    app.get('/show/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result);
    });

    app.post('/add-coffee', async (req, res) => {
        const newCoffee = req.body;
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
    });

    app.put('/update-coffee/:id', async (req, res) => {
        const id = req.params.id;
        const updatedCoffee = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updateCoffee = {
            $set:{
                coffeeName: updatedCoffee.coffeeName, 
                quantity: updatedCoffee.quantity, 
                taste: updatedCoffee.taste,
                chef: updatedCoffee.chef, 
                price: updatedCoffee.price, 
                details: updatedCoffee.details,
                supplier: updatedCoffee.supplier,
                category: updatedCoffee.category,
                photoURL: updatedCoffee.photoURL
            }
        };
        const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
        res.send(result);
    });

    app.delete('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
    });

    app.get('/users', async (req, res) => {
        const users = userCollection.find();
        const result = await users.toArray();
        res.send(result);
    });

    app.post('/user', async (req, res) => {
        const userData = req.body;
        const result = await userCollection.insertOne(userData);
        res.send(result);
    });

    app.patch('/user', async (req, res) => {
        const updateUser = req.body;
        const options = { upsert: true };
        const filter = { email: updateUser.email };
        const updatedUser = {
            $set:{
                lastLoggedIn: updateUser.lastLoggedIn
            }
        }; 
        const result = await userCollection.updateOne(filter, updatedUser, options);
        res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {}
}
run().catch(console.log);




app.listen(PORT, () => {
    console.log(`Server is Active at PORT: ${PORT}`);
})
