const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/seller', require('./routes/seller'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopez';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected to:', MONGO_URI);
    await require('./seedData')();
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Make sure MongoDB is running: mongod --dbpath /data/db');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
