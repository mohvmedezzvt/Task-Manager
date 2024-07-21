const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = (url) => {
  return mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;
