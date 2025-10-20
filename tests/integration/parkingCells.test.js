const request = require('supertest');
const { setupIntegrationTests } = require('../setup/integrationSetup');
const { generateTestToken } = require('../helpers/jwtHelper');

describe('Parking Cells Integration Tests', () => {
  let server;
  let validToken;

  beforeAll(async () => {
    server = await setupIntegrationTests();
    validToken = generateTestToken();
  }, 30000);

  describe('GET /api/parking-cells', () => {
    it('should return all parking cells', async () => {
      const response = await request(server)
        .get('/api/parking-cells')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return parking cells with correct structure', async () => {
      const response = await request(server)
        .get('/api/parking-cells')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .expect(200);

      if (response.body.length > 0) {
        const cell = response.body[0];
        expect(cell).toHaveProperty('id');
        expect(cell).toHaveProperty('idStatic');
        expect(cell).toHaveProperty('state');
        expect(['disponible', 'ocupado', 'reservado', 'inhabilitado']).toContain(cell.state);
      }
    });
  });

  describe('PUT /api/parking-cells/:id/status', () => {
    it('should update parking cell status successfully', async () => {
      const updateData = {
        state: 'ocupado',
        reservationDetails: {
          reservedBy: 'user123',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          reason: 'Test reservation'
        }
      };

      const response = await request(server)
        .put('/api/parking-cells/1/status')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid state', async () => {
      const updateData = {
        state: 'invalid_state'
      };

      const response = await request(server)
        .put('/api/parking-cells/1/status')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing reservation details when state is reservado', async () => {
      const updateData = {
        state: 'reservado'
        // Missing reservationDetails
      };

      const response = await request(server)
        .put('/api/parking-cells/1/status')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/parking-cells/bulk-status', () => {
    it('should update multiple parking cells successfully', async () => {
      const bulkUpdateData = {
        sectores: [
          {
            celdas: {
              '1': 'ocupado',
              '2': 'disponible',
              '3': 'reservado'
            }
          }
        ]
      };

      const response = await request(server)
        .post('/api/parking-cells/bulk-status')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .send(bulkUpdateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid state in bulk update', async () => {
      const bulkUpdateData = {
        sectores: [
          {
            celdas: {
              '1': 'invalid_state'
            }
          }
        ]
      };

      const response = await request(server)
        .post('/api/parking-cells/bulk-status')
        .set('Authorization', `Bearer ${validToken}`)
        .timeout({ deadline: 15000, response: 10000 })
        .send(bulkUpdateData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});