
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/connectDB.js');

const fanRoutes = require('./routes/fanRoutes.js');
const artistRoutes = require('./routes/artistRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const eventRoutes = require('./routes/eventRoutes.js');

dotenv.config();


const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
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
app.use('/api/events', eventRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});