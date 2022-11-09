const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        //To find all the data from servers 
    app.get('/services', async(req, res)=> {
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services)
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