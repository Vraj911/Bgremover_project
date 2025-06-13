import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/Mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
const app = express();
app.use(express.json());
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => res.send("working"));
app.use('/api/user', userRouter);
app.use('/api/image',imageRouter)
app.get('/favicon.ico', (req, res) => res.status(204).end());

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();

export default app;