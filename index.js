const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middeleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gieptu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const usersColllection = client.db('CurdDb').collection('user');
   

     app.post('/user', async (req,res)=>{
   const user= req.body;
   const result= await usersColllection.insertOne(user);
   res.send(result);
     })


     app.get('/user', async(req,res)=>{
     
      const result =await usersColllection.find().toArray();
      res.send(result);

     });

     app.delete('/user/:id',async (req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await usersColllection.deleteOne(query);
      res.send(result);


     });
// update first step
     app.get('/user/:id', async(req,res)=>{
      const id= req.params.id;
      const query={_id: new ObjectId(id)};
      const result = await usersColllection.findOne(query);
      res.send(result);
     })

    //  update 2nd step
  app.put('/user/:id' ,async(req,res)=>{
    const id= req.params.id;
     const user= req.body;
     const filter = {_id: new ObjectId(id) };
     const options = { upsert: true };

     const update = {
      $set: {
        name:user.name,
        email:user.email,
        phone:user.phone,
        location:user.location,
        address:user.address

      }
    
    }
    const result = await usersColllection.updateOne( filter,update, options);
    res.send(result)
  });  


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res)=>{
    res.send('testy delicious resturant')
})

app.listen(port, ()=>{
    console.log(`testy delicious rasturant is running on port ${port}`);
})