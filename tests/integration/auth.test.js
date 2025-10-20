const request = require('supertest');
const { setupIntegrationTests } = require('../setup/integrationSetup');
const { generateTestToken } = require('../helpers/jwtHelper');

describe('Auth Integration Tests', () => {
  let server;

  beforeAll(async () => {
    server = await setupIntegrationTests();
  }, 30000);
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New',
        lastName: 'User'
      };

      const response = await request(server)
        .post('/api/auth/register-test-user')
        .timeout({ deadline: 15000, response: 10000 })
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('errors');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('newuser');
      expect(response.body.user.email).toBe('newuser@example.com');
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(server)
        .post('/api/auth/register-test-user')
        .timeout({ deadline: 15000, response: 10000 })
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for short password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(server)
        .post('/api/auth/register-test-user')
        .timeout({ deadline: 15000, response: 10000 })
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for missing required fields', async () => {
      const userData = {
        username: 'testuser'
        // Missing email and password
      };

      const response = await request(server)
        .post('/api/auth/register-test-user')
        .timeout({ deadline: 15000, response: 10000 })
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First register a user
      const userData = {
        username: 'logintest',
        email: 'logintest@example.com',
        password: 'password123',
        name: 'Login',
        lastName: 'Test'
      };

      await request(server)
        .post('/api/auth/register-test-user')
        .timeout({ deadline: 20000, response: 15000 })
        .send(userData);

      // Then login
      const loginData = {
        username: 'logintest',
        password: 'password123'
      };

      const response = await request(server)
        .post('/api/auth/login')
        .set('Authorization', 'Bearer test-token')
        .timeout({ deadline: 20000, response: 15000 })
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('errors');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'wrongpassword'
      };

      const response = await request(server)
        .post('/api/auth/login')
        .set('Authorization', 'Bearer test-token')
        .timeout({ deadline: 15000, response: 10000 })
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for missing credentials', async () => {
      const loginData = {
        username: 'testuser'
        // Missing password
      };

      const response = await request(server)
        .post('/api/auth/login')
        .set('Authorization', 'Bearer test-token')
        .timeout({ deadline: 15000, response: 10000 })
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/verify-token', () => {
    it('should verify valid token', async () => {
      // First register and login to get a token
      const userData = {
        username: 'verifytest',
        email: 'verifytest@example.com',
        password: 'password123',
        name: 'Verify',
        lastName: 'Test'
      };

      await request(server)
        .post('/api/auth/register-test-user')
        .timeout({ deadline: 20000, response: 15000 })
        .send(userData);

      const loginResponse = await request(server)
        .post('/api/auth/login')
        .set('Authorization', 'Bearer test-token')
        .timeout({ deadline: 20000, response: 15000 })
        .send({
          username: 'verifytest',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      const response = await request(server)
        .post('/api/auth/verify-token')
        .set('Authorization', 'Bearer test-token')
        .timeout({ deadline: 15000, response: 10000 })
        .send({ token })
        .expect(200);

      expect(response.body).toHaveProperty('valid');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 400 for missing token', async () => {
      const response = await request(server)
        .post('/api/auth/verify-token')
        .set('Authorization', 'Bearer test-token')
        .timeout({ deadline: 15000, response: 10000 })
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(server)
        .post('/api/auth/verify-token')
        .set('Authorization', 'Bearer test-token')
        .timeout({ deadline: 15000, response: 10000 })
        .send({ token: 'invalid-token' })
        .expect(401);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(server)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer test-token')
        .timeout({ deadline: 15000, response: 10000 })
        .send({ token: 'some-token' })
        .expect(200);

      expect(response.body).toHaveProperty('errors');
    });
  });
});