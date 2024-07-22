const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const notificationRoutes = require('./routes/notifications');

require('dotenv').config();


// Middlewares
app.use(express.static('./public'));
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/notifications', notificationRoutes); 

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
