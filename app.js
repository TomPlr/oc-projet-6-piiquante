const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();
const uri = process.env.MONGO_URI;

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successful connection to MongoDB ✅'))
  .catch((error) => console.log('Connection to MongoDB failed ❌ => ' + error));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
