import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/Mongodb.js'; 
const PORT=process.env.PORT || 4000
const app=express();
await connectDB();
app.use(express.json());
app.use(cors());
app.get('/',(req,res)=>{res.send("working")});
app.listen(PORT,()=>console.log("serving running on port "+PORT))