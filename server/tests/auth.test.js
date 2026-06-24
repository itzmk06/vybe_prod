const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const { authRouter } = require('../src/routes/authRoutes');   // was ../routes/authRoutes
const { User } = require('../src/models/User');                // was ../models/User
// Build a test app so we don't need to start the real server
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter);

describe('Auth Routes', () => {
  const validUser = {
    userName: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    emailId: 'test@example.com',
    password: 'Test@1234'
  };

  // ─── SIGNUP ───
  describe('POST /signup', () => {
    it('should create a new user, return 201 and set auth cookies', async () => {
      const res = await request(app)
        .post('/signup')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully!');
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.emailId).toBe(validUser.emailId);
      // Password & refreshToken should NOT be in response
      expect(res.body.data).not.toHaveProperty('password');
      expect(res.body.data).not.toHaveProperty('refreshToken');

      // Cookies should be set
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(c => c.includes('token='))).toBe(true);
      expect(cookies.some(c => c.includes('refresh_token='))).toBe(true);

      // Verify user was actually saved in DB
      const dbUser = await User.findOne({ emailId: validUser.emailId });
      expect(dbUser).toBeTruthy();
      expect(dbUser.refreshToken).toBeTruthy();
    });

    it('should return 400 if user already exists', async () => {
      await request(app).post('/signup').send(validUser);

      const res = await request(app)
        .post('/signup')
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists!');
    });

    it('should return 500 for invalid email', async () => {
      const res = await request(app)
        .post('/signup')
        .send({ ...validUser, emailId: 'not-an-email' });

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/valid email/i);
    });

    it('should return 500 for weak password', async () => {
      const res = await request(app)
        .post('/signup')
        .send({ ...validUser, password: '123' });

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/strong/i);
    });

    it('should return 500 for missing userName', async () => {
      const { userName, ...rest } = validUser;
      const res = await request(app)
        .post('/signup')
        .send(rest);

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/user name is required/i);
    });
  });

  // ─── LOGIN ───
  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app).post('/signup').send(validUser);
    });

    it('should login with valid credentials and set cookies', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          emailId: validUser.emailId,
          password: validUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged in successfully!');
      expect(res.body.data).toHaveProperty('emailId');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          emailId: validUser.emailId,
          password: 'WrongPass@123'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          emailId: 'ghost@example.com',
          password: validUser.password
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  // ─── REFRESH TOKEN ───
  describe('POST /refreshToken', () => {
    let refreshCookie;

    beforeEach(async () => {
      const signupRes = await request(app).post('/signup').send(validUser);
      refreshCookie = signupRes.headers['set-cookie'].find(c =>
        c.includes('refresh_token=')
      );
    });

    it('should refresh access token with valid refresh token', async () => {
      const res = await request(app)
        .post('/refreshToken')
        .set('Cookie', [refreshCookie]);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Access token refreshed!');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 if no refresh token cookie', async () => {
      const res = await request(app).post('/refreshToken');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Refresh token not found!');
    });

    it('should return 401 for tampered refresh token', async () => {
      const res = await request(app)
        .post('/refreshToken')
        .set('Cookie', ['refresh_token=invalid.token.here']);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Refresh token expired!');
    });

    it('should return 401 if user changed refresh token in DB', async () => {
      // Simulate token reuse / logout by clearing DB token
      await User.updateOne(
        { emailId: validUser.emailId },
        { refreshToken: null }
      );

      const res = await request(app)
        .post('/refreshToken')
        .set('Cookie', [refreshCookie]);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid refresh token!');
    });
  });

  // ─── LOGOUT ───
  describe('POST /logout', () => {
    it('should clear cookies and nullify refresh token in DB', async () => {
      const signupRes = await request(app).post('/signup').send(validUser);
      const refreshCookie = signupRes.headers['set-cookie'].find(c =>
        c.includes('refresh_token=')
      );

      const res = await request(app)
        .post('/logout')
        .set('Cookie', [refreshCookie]);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully!');

      // Cookies should be cleared (empty value + past expiry)
      const cookies = res.headers['set-cookie'];
      expect(cookies.some(c => c.includes('token=;'))).toBe(true);
      expect(cookies.some(c => c.includes('refresh_token=;'))).toBe(true);

      const user = await User.findOne({ emailId: validUser.emailId });
      expect(user.refreshToken).toBeNull();
    });

    it('should succeed logout even without refresh token', async () => {
      const res = await request(app).post('/logout');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully!');
    });
  });

  // ─── GET /user (Protected) ───
  describe('GET /user', () => {
    let authCookie;

    beforeEach(async () => {
      const signupRes = await request(app).post('/signup').send(validUser);
      authCookie = signupRes.headers['set-cookie'].find(c =>
        c.includes('token=')
      );
    });

    it('should return user data with valid token', async () => {
      const res = await request(app)
        .get('/user')
        .set('Cookie', [authCookie]);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User authenticated!');
      expect(res.body.data).toHaveProperty('emailId');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/user');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized! Please log in.');
    });
  });
});