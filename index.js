const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require("cors")
const app = express()
const ObjectId = require('mongodb').ObjectId

const port = 5000

// middle wire
app.use(cors())

app.use(express.json())



const uri = "mongodb+srv://faizdbuser:n1JBc08KivNVAcwr@cluster0.wusl0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("test");
        const usersCollection = database.collection("user");
        // get api

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({})
            const users = await cursor.toArray()
            res.send(users)
        })
        // post api

        app.post('/users', async (req, res) => {
            const newUser = req.body
            const result = await usersCollection.insertOne(newUser)
            console.log('hitting the post', req.body);
            console.log('added user', result)
            res.send(result)
        })
        // delete single api
        app.delete('/users/:id', async (req, res) => {

            const id = req.params.id

            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            console.log('going to user delete with id', result)
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('running my  crud operation')
})
app.listen(port, () => {
    console.log('litsening frmo', port)
})