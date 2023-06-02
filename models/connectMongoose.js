'use strict';

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connection.on('error', err => {
  console.log('connection error', err);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB en ${mongoose.connection.name}`);
});

mongoose.connect(process.env.MONGODB_CONNECTION_STR, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
