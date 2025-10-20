const ParkingCellController = require('../../../src/adapters/controllers/parkingCellController');

describe('ParkingCellController', () => {
  let mockGetAllParkingCellHandler;
  let mockUpsertParkingCellHandler;
  let mockBulkStatusUpdateHandler;
  let controller;

  beforeEach(() => {
    mockGetAllParkingCellHandler = {
      handle: jest.fn()
    };
    mockUpsertParkingCellHandler = {
      handle: jest.fn()
    };
    mockBulkStatusUpdateHandler = {
      handle: jest.fn()
    };
    controller = new ParkingCellController(
      mockGetAllParkingCellHandler,
      mockUpsertParkingCellHandler,
      mockBulkStatusUpdateHandler
    );
  });

  describe('getAllParkingCells', () => {
    it('should return all parking cells', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockCells = [
        { id: 'cell1', idStatic: 1, state: 'disponible' },
        { id: 'cell2', idStatic: 2, state: 'ocupado' }
      ];

      mockGetAllParkingCellHandler.handle.mockResolvedValue(mockCells);

      await controller.getAllParkingCells(req, res);

      expect(mockGetAllParkingCellHandler.handle).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCells);
    });

    it('should handle errors', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockGetAllParkingCellHandler.handle.mockRejectedValue(new Error('Database error'));

      await controller.getAllParkingCells(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error'
      });
    });
  });

  describe('updateParkingCellStatus', () => {
    it('should update parking cell status successfully', async () => {
      const req = {
        params: { id: '1' },
        body: {
          state: 'ocupado',
          reservationDetails: null
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = { success: true };

      mockUpsertParkingCellHandler.handle.mockResolvedValue(mockResult);

      await controller.updateParkingCellStatus(req, res);

      expect(mockUpsertParkingCellHandler.handle).toHaveBeenCalledWith({
        id: '1',
        state: 'ocupado',
        reservationDetails: null
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true
      });
    });

    it('should handle update errors', async () => {
      const req = {
        params: { id: '1' },
        body: {
          state: 'ocupado',
          reservationDetails: null
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockUpsertParkingCellHandler.handle.mockRejectedValue(new Error('Update error'));

      await controller.updateParkingCellStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Update error'
      });
    });
  });

  describe('bulkUpdateParkingCellStatus', () => {
    it('should bulk update parking cells successfully', async () => {
      const req = {
        body: {
          updates: [
            { id: '1', state: 'ocupado' },
            { id: '2', state: 'disponible' }
          ]
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = { success: true, updated: 2 };

      mockBulkStatusUpdateHandler.handle.mockResolvedValue(mockResult);

      await controller.bulkUpdateParkingCellStatus(req, res);

      expect(mockBulkStatusUpdateHandler.handle).toHaveBeenCalledWith({
        updates: [
          { id: '1', state: 'ocupado' },
          { id: '2', state: 'disponible' }
        ]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        updated: 2
      });
    });

    it('should handle bulk update errors', async () => {
      const req = {
        body: {
          updates: [
            { id: '1', state: 'ocupado' }
          ]
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockBulkStatusUpdateHandler.handle.mockRejectedValue(new Error('Bulk update error'));

      await controller.bulkUpdateParkingCellStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Bulk update error'
      });
    });
  });
});
