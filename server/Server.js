import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/Mongodb.js';
const PORT=process.env.PORT || 4000;
const app = express();
await connectDB();
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => res.send("working"));
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.listen(PORT,()=>console.log("server running on PORT "+PORT))
export default app; 
