const ParkingCellController = require('../../../src/adapters/controllers/parkingCellController');
const BulkStatusUpdateCommand = require('../../../src/core/services/features/parkingCell/command/bulkStatusUpdate/bulkStatusUpdateCommand');
const UpsertParkingCellCommand = require('../../../src/core/services/features/parkingCell/command/upsertParkingCell/upsertParkingCellCommand');

describe('ParkingCellController', () => {
  let controller;
  let mockBulkStatusWithHistoryUseCase;
  let mockGetAllParkingCellHandler;
  let mockUpsertParkingCellHandler;

  beforeEach(() => {
    mockBulkStatusWithHistoryUseCase = {
      execute: jest.fn()
    };
    mockGetAllParkingCellHandler = {
      handle: jest.fn()
    };
    mockUpsertParkingCellHandler = {
      handle: jest.fn()
    };

    controller = new ParkingCellController(
      mockBulkStatusWithHistoryUseCase,
      mockGetAllParkingCellHandler,
      mockUpsertParkingCellHandler
    );

    jest.clearAllMocks();
  });

  describe('bulkStatusUpdate', () => {
    it('should update bulk status successfully', async () => {
      const req = {
        body: {
          cells: [
            { idStatic: 1, state: 'ocupado' },
            { idStatic: 2, state: 'disponible' }
          ]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockBulkStatusWithHistoryUseCase.execute.mockResolvedValue();

      await controller.bulkStatusUpdate(req, res);

      expect(mockBulkStatusWithHistoryUseCase.execute).toHaveBeenCalledWith(expect.any(BulkStatusUpdateCommand));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bulk status updated successfully.' });
    });

    it('should handle bulk status update errors', async () => {
      const req = {
        body: {
          cells: [
            { idStatic: 1, state: 'invalid_state' }
          ]
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockBulkStatusWithHistoryUseCase.execute.mockRejectedValue(new Error('Invalid state'));

      await controller.bulkStatusUpdate(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while updating statuses.' });
    });
  });

  describe('updateStatus', () => {
    it('should update status successfully', async () => {
      const req = {
        params: { id: '1' },
        body: {
          state: 'ocupado',
          reservationDetails: {
            reservedBy: 'user123',
            startTime: new Date(),
            endTime: new Date(),
            reason: 'Meeting'
          }
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockUpsertParkingCellHandler.handle.mockResolvedValue();

      await controller.updateStatus(req, res);

      expect(mockUpsertParkingCellHandler.handle).toHaveBeenCalledWith(expect.any(UpsertParkingCellCommand));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Estado actualizado' });
    });

    it('should handle update status errors', async () => {
      const req = {
        params: { id: '1' },
        body: {
          state: 'invalid_state'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockUpsertParkingCellHandler.handle.mockRejectedValue(new Error('Invalid state'));

      await controller.updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid state' });
    });
  });

  describe('getAll', () => {
    it('should get all parking cells successfully', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockData = [
        { id: '1', idStatic: 1, state: 'disponible' },
        { id: '2', idStatic: 2, state: 'ocupado' }
      ];

      mockGetAllParkingCellHandler.handle.mockResolvedValue(mockData);

      await controller.getAll(req, res);

      expect(mockGetAllParkingCellHandler.handle).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle get all errors', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockGetAllParkingCellHandler.handle.mockRejectedValue(new Error('Database error'));

      await controller.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno' });
    });
  });
});