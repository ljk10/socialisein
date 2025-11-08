const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // Make sure this is imported
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// --- Middlewares ---

// ✅ THIS IS THE FIX ✅
// Enable CORS for all routes. 
// This MUST be before your routes are defined.
app.use(cors()); 

// Allow app to accept JSON data
app.use(express.json());

// --- Define Routes ---
// (These MUST come AFTER app.use(cors()))
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Define the port to run on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});