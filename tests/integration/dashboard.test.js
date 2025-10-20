const request = require('supertest');
const { setupIntegrationTests } = require('../setup/integrationSetup');
const { generateTestToken } = require('../helpers/jwtHelper');

describe('Dashboard Integration Tests', () => {
  let server;
  let validToken;

  beforeAll(async () => {
    server = await setupIntegrationTests();
    validToken = generateTestToken();
  }, 30000);

  describe('GET /api/dashboard', () => {
    it('should return dashboard data', async () => {
      const response = await request(server)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .expect(200);

      expect(response.body).toHaveProperty('Parqueaderos');
      expect(response.body).toHaveProperty('Recomendaciones');
      expect(Array.isArray(response.body.Parqueaderos)).toBe(true);
      expect(Array.isArray(response.body.Recomendaciones)).toBe(true);
    });

    it('should return parking spaces with correct structure', async () => {
      const response = await request(server)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .expect(200);

      if (response.body.Parqueaderos.length > 0) {
        const parkingSpace = response.body.Parqueaderos[0];
        expect(parkingSpace).toHaveProperty('parquederoid');
        expect(parkingSpace).toHaveProperty('Estado');
        expect(['disponible', 'ocupado', 'reservado', 'inhabilitado']).toContain(parkingSpace.Estado);
      }
    });

    it('should return recommendations with correct structure', async () => {
      const response = await request(server)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .expect(200);

      if (response.body.Recomendaciones.length > 0) {
        const recommendation = response.body.Recomendaciones[0];
        expect(recommendation).toHaveProperty('message');
        expect(typeof recommendation.message).toBe('string');
      }
    });
  });

  describe('GET /api/recommendations', () => {
    it('should return recommendations', async () => {
      const response = await request(server)
        .get('/api/recommendations')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return recommendations with correct structure', async () => {
      const response = await request(server)
        .get('/api/recommendations')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .expect(200);

      if (response.body.length > 0) {
        const recommendation = response.body[0];
        expect(recommendation).toHaveProperty('message');
        expect(typeof recommendation.message).toBe('string');
      }
    });
  });
});