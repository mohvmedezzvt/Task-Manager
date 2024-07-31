const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/User');

require('dotenv').config({ path: '.env.test' });

describe('User authentication', () => {
  beforeEach(async () => {
    await mongoose.connection.close();
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
  });

  describe('User registration', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'Test#1234'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.headers['x-auth-token']).toBeDefined();
    });

    it('should not register a user with an existing email', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser2',
          email: 'testuser2@example.com',
          password: 'Test#1234'
        });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser3',
          email: 'testuser2@example.com',
          password: 'Test#1234'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should not register a user with an invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser3',
          email: 'testuser3example',
          password: 'Test1234'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', '"email" must be a valid email');
    });

    it('should not register a user with a weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser4',
          email: 'testuser4@gmail.com',
          password: 'password'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', '"password" should contain at least 1 upper-cased letter');
    });

    it('should not register a user with missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser5',
          email: 'testuser5@example.com',
          password: ''
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Password cannot be an empty field');
    });
  });

  describe('User login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'Test#1234'
        });
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    afterAll(async () => {
      await mongoose.connection.close();
    });

    it('should login a user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'Test#1234'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login a user with incorrect email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuserrrexample.com',
          password: 'Test1234'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', '"email" must be a valid email');
    });

    it('should not login a user with incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'Test12345'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should not login a user with missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@example.com',
          password: ''
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', '"password" is not allowed to be empty');
    });

    it('should not login a user that does not exist', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuserrr@example.com',
          password: 'Test1234'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});
