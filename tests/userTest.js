const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/infrastructure/http/app');

describe('User Service Test', () => {
  it('should create a user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'testuser@example.com',
        password: 'Password1!',
        role: 'userEnd',
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('uid');
  });

  it('should login and return token', async () => {
    const response = await request(app)
      .post('/api/sessions')
      .send({
        email: 'testuser@example.com',
        password: 'Password1!',
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });
});