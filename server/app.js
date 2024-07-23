const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

require('dotenv').config();

// Middlewares
app.use(express.static('./public'));
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/projects', require('./routes/projects'));
app.use('/api/v1/notifications', require('./routes/notifications')); 

// Error handling
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

start();
