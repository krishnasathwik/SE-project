// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./api'); // Import API routes from api.js

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // CORS if frontend and backend are on different ports/domains

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/se-project')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Use API routes
app.use('/api', apiRoutes); // Prefix all API routes with /api

// Server setup
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
