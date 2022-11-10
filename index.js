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
        const reviewCollection = client.db('reviewCollection').collection('addReviews')
    
        function verifyJWT(req, res, next){
            const authHeader = req.headers.authorization
            if(!authHeader){
              return res.status(401).send({message: 'Unauthorized Access'})
            }
            const token = authHeader.split(' ')[1]
            jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, function(err, decoded ) {
          
              if(err) {
                return res.status(401).send({message: 'Unauthorized Access'})
              }
              req.decoded = decoded ;
              next()
          
            })
          }
          
     
     
     
     
     
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

    // Get Method for Added 
    app.get('/added', async(req, res) => {
        // const decoded = req.decoded; 
        // console.log('Inside orders Api', decoded)
        // if(decoded.email !== req.query.email){
        //     res.status(403).send({message: 'UnAuthorized access'})
        //   }
        let query = {} 
        if (req.query.email){
            query = {
                email:req.query.email
            }
        }
        const cursor = addedServiceCollection.find(query)
        const orders = await cursor.toArray()
        res.send(orders)
    })

    app.get('/review', async(req,res)=> {
        let query = {}
        if (req.query.email){
            query = {
                email:req.query.email
            }
        }
        const cursor = reviewCollection.find(query)
        const review = await cursor.toArray()
        res.send(review)
    })


    // End Of Loaded Data 

    /**Start of AddedCollection API */

    app.post('/added', async(req, res) => {
        const addedService = req.body; 
        const result = await addedServiceCollection.insertOne(addedService)
        res.send(result)
    })

    /**Adding Review API */

    app.post('/reviews', async(req, res) => {
        const addReview = req.body; 
        const result = await reviewCollection.insertOne(addReview); 
        res.send(result)
    })




    //updating Added Service Status 
    app.patch('/added/:id',  async(req, res)=> {
        const id = req.params.id;
        const status = req.body.status
        const query = {_id:ObjectId(id)}
        const updatedDoc = {
          $set: {
            status: status
          }
        }
        const result = await addedServiceCollection.updateOne(query, updatedDoc)
        res.send(result)
      })

      app.patch('/review/:id',  async(req, res)=> {
        const id = req.params.id;
        const status = req.body.status
        const query = {_id:ObjectId(id)}
        const updatedDoc = {
          $set: {
            status: status
          }
        }
        const result = await reviewCollection.updateOne(query, updatedDoc)
        res.send(result)
      })
      






    //Deleting Items 
    app.delete('/added/:id',  async(req, res)=> {
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
      
        const result = await addedServiceCollection.deleteOne(query);
        res.send(result)
        })
    app.delete('/reviews/:id',  async(req, res)=> {
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
      
        const result = await reviewCollection.deleteOne(query);
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