const request = require('supertest');
const app = require('../../src/adapters/app');

describe('Dashboard Integration Tests', () => {
  describe('GET /api/dashboard', () => {
    it('should return dashboard data', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .expect(200);

      expect(response.body).toHaveProperty('parkingSpaces');
      expect(response.body).toHaveProperty('recommendations');
      expect(Array.isArray(response.body.parkingSpaces)).toBe(true);
      expect(Array.isArray(response.body.recommendations)).toBe(true);
    });

    it('should return parking spaces with correct structure', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .expect(200);

      if (response.body.parkingSpaces.length > 0) {
        const space = response.body.parkingSpaces[0];
        expect(space).toHaveProperty('id');
        expect(space).toHaveProperty('idStatic');
        expect(space).toHaveProperty('state');
        expect(space).toHaveProperty('ubicacion');
        expect(space).toHaveProperty('ultimaActualizacion');
      }
    });

    it('should return recommendations with correct structure', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .expect(200);

      if (response.body.recommendations.length > 0) {
        const recommendation = response.body.recommendations[0];
        expect(recommendation).toHaveProperty('id');
        expect(recommendation).toHaveProperty('message');
        expect(recommendation).toHaveProperty('priority');
        expect(recommendation).toHaveProperty('type');
      }
    });
  });

  describe('GET /api/recommendations', () => {
    it('should return recommendations', async () => {
      const response = await request(app)
        .get('/api/recommendations')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return recommendations with correct structure', async () => {
      const response = await request(app)
        .get('/api/recommendations')
        .expect(200);

      if (response.body.length > 0) {
        const recommendation = response.body[0];
        expect(recommendation).toHaveProperty('id');
        expect(recommendation).toHaveProperty('message');
        expect(recommendation).toHaveProperty('priority');
        expect(recommendation).toHaveProperty('type');
      }
    });
  });
});
