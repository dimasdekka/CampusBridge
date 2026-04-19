import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import supervisionRoutes from './routes/supervision';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/supervisions', supervisionRoutes);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
