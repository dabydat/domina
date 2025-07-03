// auth-service/src/index.js
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3999' }));

connectDB();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[Auth Service] escuchando en el puerto ${PORT}`);
});
