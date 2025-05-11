const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/infrastructure/http/app');

describe('Parking Service Test', () => {
  it('should create a parking entry', async () => {
    const response = await request(app)
      .post('/api/parkings')
      .send({ parquederoid: 1, estado: 'disponible' });

    expect(response.status).to.be.oneOf([200, 201]);
  });

  it('should get current parking status', async () => {
    const response = await request(app)
      .get('/api/parkings')
      .query({ id: 1 });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('estado');
  });
});