// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chat');

// Create express app
const app = express();

// Middleware - these run on every request
app.use(cors({ 
  origin: 'http://localhost:5174'  // Allow React frontend
}));
app.use(express.json());  // Allow reading JSON from requests

// Routes
app.use('/api/chat', chatRoutes);

// Test route - open http://localhost:5000 to check
app.get('/', (req, res) => {
  res.json({ message: '✅ Smart Spend Server is Running!' });
});

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running at http://localhost:5000`);
      console.log('Waiting for requests...');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed!');
    console.error(err);
  });