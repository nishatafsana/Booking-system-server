const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors =require("cors")
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cdvngs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    const usersCollection = client.db('BookingSystem').collection('users')
    const roomsCollection = client.db('BookingSystem').collection('rooms')
    const bookingsCollection = client.db('BookingSystem').collection('bookings')
    // save user email;
    app.put('/users/:email',async(req,res)=>{
      const email=req.params.email;
      const user =req.body
      const query={email:email}
      const options={upsert:true}
      const updateDoc={
        $set:user
      }
      const result = await usersCollection.updateOne(query,updateDoc,options)
      console.log(result)
      res.send(result)

    })

// save room for database........
app.post('/rooms',async(req,res)=>{
  const room=req.body;
  console.log(room)
  const result=await roomsCollection.insertOne(room)
  res.send(result)
})

// save booking in database
app.post('/bookings',async(req,res)=>{
  const booking=req.body;
  console.log(booking)
  const result=await bookingsCollection.insertOne(booking)
  res.send(result)
})

// // DELETE  booking..
// app.delete('/bookings/:id',async(req,res)=>{
//   const id =req.params.id
// const query={_id:new ObjectId(id)}
// const result=await bookingsCollection.deleteOne(query)
// res.send(result)
// })


// update roomBooking state...
app.patch('/rooms/status/:id',async(req,res)=>{
  const id =req.params.id
const status=req.body.status 
const query={_id:new ObjectId(id)}
const updateDoc={
  $set:{
    booked:status,
  },

}
const update=await roomsCollection.updateOne(query,updateDoc)
res.send(update)
})

// get booking for guest.
app.get('/bookings',async(req,res)=>{
  const email=req.query.email 
  if(!email){
    res.send([])
  }
  const query={'guest.email':email}
  const result=await bookingsCollection.find(query).toArray()
  res.send(result)
  
})
// get all ROOMS ......
app.get('/rooms',async(req,res)=>{
  const result=await roomsCollection.find().toArray()
  res.send(result)
})
// delet room..
app.delete('/rooms/:id',async(req,res)=>{
  const id =req.params.id 
  const query={_id: new ObjectId(id) }
  const result=await roomsCollection.deleteOne(query)
  console.log(result)
  res.send(result)
})

// get a single room/booking ar jonno.......
app.get('/rooms/:email',async(req,res)=>{
  const email =req.params.email 
  const query={'host.email':email }
  const result=await roomsCollection.find(query).toArray()
  console.log(result)
  res.send(result)
})

// get a single room.......
app.get('/room/:id',async(req,res)=>{
  const id =req.params.id 
  const query={_id: new ObjectId(id) }
  const result=await roomsCollection.findOne(query)
  console.log(result)
  res.send(result)
})

// get user......
app.get('/users/:email',async(req,res)=>{
  const email=req.params.email 
  const query={email:email}
  const result=await usersCollection.findOne(query)
  console.log(result)
  res.send(result)
})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`server is running ${port}`)
})