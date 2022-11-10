const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 9000;
require('dotenv').config()

app.use(cors());
app.use(express.json())



// Mongodb Connection 
console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4nsbrbj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        const serviceCollection = client.db('healthCoach').collection('services')
        const addedServiceCollection = client.db('addedCollection').collection('addedServices')
        const reviewCollection = client.db('reviewCollection').collection('reviews')
        //To find all the data from servers 
    app.get('/services', async(req, res)=> {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
          })

    app.get('/services/limit', async(req, res)=> {
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.limit(3).toArray();
        res.send(services)
      })

    app.get('/services/:id', async(req, res)=> {
        const id = req.params.id; 
        const query = {_id:ObjectId(id)}
        const service = await serviceCollection.findOne(query)
        res.send(service)
    })

    // End Of Loaded Data 

    /**Start of AddedCollection API */

    app.post('/added', async(req, res) => {
        const addedService = req.body; 
        const result = await addedServiceCollection.insertOne(addedService)
        res.send(result)
    })





    }
    catch{

    }
}
run().catch(err => console.error(err))






app.get('/', (req, res)=> {
    res.send('Health Coach server is running')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})