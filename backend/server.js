// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Test Route
app.get('/', (req, res) => {
  res.send('Event Registration API is running...');
});

// Import Routes
const participantRoutes = require('./routes/participantRoutes');
app.use('/api/participants', participantRoutes);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
sequelize.sync().then(() => {
  console.log('✅ MySQL Database synchronized.');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Database connection failed:', err.message);
});