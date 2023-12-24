const express=require('express')
const cors=require('cors')
const app=express();
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('TaskFlow is running')
})

app.listen(port,()=>{
    console.log(`TaskFlow is listening on port: ${port}`)
})