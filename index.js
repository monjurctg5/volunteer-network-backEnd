const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT ||5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghw3k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const Volunteercollection = client.db("Volunteer-Network").collection("Volunteer");

  const Eventcollection = client.db("Volunteer-Network").collection("Events");
  


  app.get('/Events',async(req,res)=>{
    const cursor = Eventcollection.find({})
    const result = await cursor.toArray()
    res.json(result)
  })

   app.get('/volunteer',async(req,res)=>{
    const cursor = Volunteercollection.find({})
    const result = await cursor.toArray()
    console.log("ami volunteer")
    res.json(result)
  })


  app.post('/Events',async(req,res)=>{
     const newEvent = req.body
    const result = await Eventcollection.insertOne(newEvent)
    res.send(result)
    
  })
  

  app.post('/volunteer',async(req,res)=>{
    console.log(req.body)
    const result = await Volunteercollection.insertOne(req.body)
    console.log(result)
    res.send(result)
  })


  app.get('/volunteer/:email', async(req,res)=>{
    const email = req.params.email
    console.log(email)
    const result = Volunteercollection.find({email:email}).toArray((er,result)=>{
      console.log(er,result)
      res.send(result)

    })
   
  })

app.post('/volunteer',async(req,res)=>{
  const newVolunteer = req.body
  const result = await Volunteercollection.insertOne(newVolunteer)
  res.json(result)

})
app.delete('/volunteer/:id',async(req,res)=>{
  console.log(req.params.id)
  const id = req.params.id
  const query = {_id:ObjectId(id)}
  const result = await Volunteercollection.deleteOne(query)
  console.log(result)
  res.send(result)
})

  // client.close();
});

app.get("/",(req,res)=>{
  res.send("hello server")
})

app.listen(port,()=>{
  console.log("server running from",port)
})