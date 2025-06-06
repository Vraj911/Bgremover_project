import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/Mongodb.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send("working"));
app.get('/favicon.ico', (req, res) => res.status(204).end());

(async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log("Server running on PORT " + PORT));
  } catch (error) {
    console.error("Failed to start server:", error);
  }
})();

export default app;
