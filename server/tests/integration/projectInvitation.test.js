const request = require('supertest');
const connectDB = require('../../../server/db/connect');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../../server/models/User');
const Project = require('../../../server/models/Project');
const Invitation = require('../../../server/models/Invitation');

require('dotenv').config({ path: '.env.test' });

describe('Project invitation', () => {
  let token, user, project;

  beforeAll(async () => {
    await connectDB(process.env.MONGO_URI);
    await User.deleteMany();
    await Project.deleteMany();
    await Invitation.deleteMany();
  });

  beforeEach(async () => {
    user = await User.create({
      username: 'testuserforinvite',
      email: 'testforinvite@example.com',
      password: 'password',
    });

    token = await user.generateAuthToken();

    project = await Project.create({
      name: 'Test Project',
      description: 'This is a test project',
      createdBy: user._id,
      members: [user._id],
    });
  });

  afterEach(async () => {
    await User.deleteMany();
    await Project.deleteMany();
    await Invitation.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should invite a user to a project', async () => {
    const recipient = await User.create({
      username: 'recipientuser',
      email: 'recipient@example.com',
      password: 'password',
    });

    const res = await request(app)
      .post(`/api/v1/projects/${project._id}/invite`)
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientId: recipient._id });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Invitation sent successfully');
  });

  it('should not invite a user to a project if the user is already a member', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${project._id}/invite`)
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientId: user._id });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User is already a member of this project');
  });

  it('should not invite a user to a project if the user has already been invited', async () => {
    const recipient = await User.create({
      username: 'recipientuser2',
      email: 'recipient2@example.com',
      password: 'password',
    });

    await Invitation.create({
      project: project._id,
      sender: user._id,
      recipient: recipient._id,
    });

    const res = await request(app)
      .post(`/api/v1/projects/${project._id}/invite`)
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientId: recipient._id });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invitation has already been sent to this user');
  });

  it('should not invite a user to a project if the project does not exist', async () => {
    const recipient = await User.create({
    username: 'recipientuser3',
    email: 'recipient3@example.com',
    password: 'password',
    });

    const res = await request(app)
    .post(`/api/v1/projects/1234567890/invite`)
    .set('Authorization', `Bearer ${token}`)
    .send({ recipientId: recipient._id });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Project not found');
  });

  it('should not invite a user to a project if the recipient does not exist', async () => {
    const res = await request(app)
    .post(`/api/v1/projects/${project._id}/invite`)
    .set('Authorization', `Bearer ${token}`)
    .send({ recipientId: '1234567890' });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });
});
