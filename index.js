const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors =require("cors")
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
// 0ZToAQQEhPJx5wub BookingSystem

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cdvngs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    const usersCollection = client.db('aircncDb').collection('users')
    const roomsCollection = client.db('aircncDb').collection('rooms')
    const bookingsCollection = client.db('aircncDb').collection('bookings')
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
app.post('/rooms',async(res,req)=>{
  const room=req.body;
  console.log(room)
  const result=await roomsCollection.insertOne(room)
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