
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/connectDB.js';

import fanRoutes from './routes/fanRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();


const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
connectDB(mongoUri);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fans', fanRoutes);
app.use('/api/artists', artistRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});