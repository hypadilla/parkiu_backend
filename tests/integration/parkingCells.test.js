const request = require('supertest');
const app = require('../../src/adapters/app');

describe('Parking Cells Integration Tests', () => {
  describe('GET /api/parking-cells', () => {
    it('should return all parking cells', async () => {
      const response = await request(app)
        .get('/api/parking-cells')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return parking cells with correct structure', async () => {
      const response = await request(app)
        .get('/api/parking-cells')
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
    it('should update parking cell status to available', async () => {
      const updateData = {
        state: 'disponible',
        reservationDetails: null
      };

      const response = await request(app)
        .put('/api/parking-cells/1/status')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should update parking cell status to occupied', async () => {
      const updateData = {
        state: 'ocupado',
        reservationDetails: null
      };

      const response = await request(app)
        .put('/api/parking-cells/1/status')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should update parking cell status to reserved with reservation details', async () => {
      const updateData = {
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user123',
          startTime: '2023-01-01T10:00:00Z',
          endTime: '2023-01-01T11:00:00Z',
          reason: 'Meeting'
        }
      };

      const response = await request(app)
        .put('/api/parking-cells/1/status')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should return 400 for invalid state', async () => {
      const updateData = {
        state: 'invalid_state',
        reservationDetails: null
      };

      const response = await request(app)
        .put('/api/parking-cells/1/status')
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid reservation details', async () => {
      const updateData = {
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user123'
          // Missing required fields
        }
      };

      const response = await request(app)
        .put('/api/parking-cells/1/status')
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/parking-cells/bulk-status', () => {
    it('should update multiple parking cells', async () => {
      const bulkUpdateData = {
        updates: [
          { id: '1', state: 'ocupado' },
          { id: '2', state: 'disponible' },
          { id: '3', state: 'inhabilitado' }
        ]
      };

      const response = await request(app)
        .put('/api/parking-cells/bulk-status')
        .send(bulkUpdateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should return 400 for empty updates array', async () => {
      const bulkUpdateData = {
        updates: []
      };

      const response = await request(app)
        .put('/api/parking-cells/bulk-status')
        .send(bulkUpdateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing updates field', async () => {
      const response = await request(app)
        .put('/api/parking-cells/bulk-status')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid state in bulk update', async () => {
      const bulkUpdateData = {
        updates: [
          { id: '1', state: 'invalid_state' }
        ]
      };

      const response = await request(app)
        .put('/api/parking-cells/bulk-status')
        .send(bulkUpdateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });
});
