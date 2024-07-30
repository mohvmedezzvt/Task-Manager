const mongoose = require('mongoose');
require('dotenv').config();

let connection;

const connectDB = async (url) => {
  if (connection) {
    return connection;
  }

  connection = mongoose.connect(url);

  return connection;
};

module.exports = connectDB;
