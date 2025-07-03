import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import taskRoutes from './routes/task.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3999' }));

connectDB();

app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`[Task Service] escuchando en el puerto ${PORT}`);
});
