const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
connectDB();

// --- Middlewares ---
app.use(cors()); 
app.use(express.json());

// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// 👇 THIS IS LIKELY THE MISSING LINE 👇
app.use('/api/users', require('./routes/users')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});