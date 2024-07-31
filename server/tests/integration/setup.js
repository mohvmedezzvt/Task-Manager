const mongoose = require('mongoose');
const app = require('../../app');

require('dotenv').config({ path: '.env.test' });

let server;

beforeAll(async () => {
  server = app.listen(5000, () => console.log('Server is running...'));
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});
