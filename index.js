const express=require('express')
const cors=require('cors')
require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_PASS}@cluster0.wcearye.mongodb.net/?retryWrites=true&w=majority`;

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

      const taskCollection=client.db('TaskFlowDB').collection('tasks')


      app.get('/task',async(req,res)=>{
         const email=req.query.email;
         const query={ email : email}
         const result=await taskCollection.find(query).toArray()
         res.send(result)
      })

      app.post('/createTask',async(req,res)=>{
          const newTask=req.body
          const result=await taskCollection.insertOne(newTask)
          res.send(result)
      })

      app.patch('/status/:id',async(req,res)=>{
          const id=req.params.id;
          const filter={_id : new ObjectId(id)}
          const newStatus=req.body;
          const updateDoc={
             $set:{
               status:newStatus.status
             }
          }
          const result=await taskCollection.updateOne(filter,updateDoc)
          res.send(result)
      })

      app.delete('/task/delete/:id',async(req,res)=>{
          const id=req.params.id;
          const query={ _id :new ObjectId(id)}
          const result=await taskCollection.deleteOne(query)
          res.send(result)
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


app.get('/',(req,res)=>{
    res.send('TaskFlow is running')
})

app.listen(port,()=>{
    console.log(`TaskFlow is listening on port: ${port}`)
})