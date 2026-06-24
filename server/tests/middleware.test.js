const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { userAuth } = require('../src/middlewares/authMiddleware');  // was ../middlewares/authMiddleware
const { User } = require('../src/models/User');                     // was ../models/User
// Mini app just for middleware testing
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/protected', userAuth, (req, res) => {
  res.status(200).json({ message: 'Success', user: req.user });
});

describe('Auth Middleware (userAuth)', () => {
  const validUser = {
    userName: 'miduser',
    firstName: 'Mid',
    lastName: 'User',
    emailId: 'mid@example.com',
    password: 'Test@1234'
  };

  beforeEach(async () => {
    await User.create(validUser);
  });

  it('should allow access with valid token and attach user to req', async () => {
    const user = await User.findOne({ emailId: validUser.emailId });
    const token = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/protected')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Success');
    expect(res.body.user).toHaveProperty('emailId');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('refreshToken');
  });

  it('should return 401 if no token cookie', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized! Please log in.');
  });

  it('should return 401 if token is expired', async () => {
    const user = await User.findOne({ emailId: validUser.emailId });
    const expiredToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '-1s' } // already expired
    );

    const res = await request(app)
      .get('/protected')
      .set('Cookie', [`token=${expiredToken}`]);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token expired!');
  });

  it('should return 401 if user no longer exists in DB', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const token = jwt.sign(
      { _id: fakeId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .get('/protected')
      .set('Cookie', [`token=${token}`]);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('User not found! Please log in again.');
  });

  it('should return 401 for malformed token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Cookie', ['token=invalid.token.here']);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid token! Please log in again.');
  });
});