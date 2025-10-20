const DashboardController = require('../../../src/adapters/controllers/dashboardController');

describe('DashboardController', () => {
  let mockGetParkingCellWithRecomendationsUseCase;
  let controller;

  beforeEach(() => {
    mockGetParkingCellWithRecomendationsUseCase = {
      execute: jest.fn()
    };
    controller = new DashboardController(mockGetParkingCellWithRecomendationsUseCase);
  });

  describe('getDashboardData', () => {
    it('should return dashboard data successfully', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        parkingSpaces: [
          { id: 'cell1', idStatic: 1, state: 'disponible' },
          { id: 'cell2', idStatic: 2, state: 'ocupado' }
        ],
        recommendations: [
          { id: '1', message: 'Recommendation 1', priority: 'high' },
          { id: '2', message: 'Recommendation 2', priority: 'medium' }
        ]
      };

      mockGetParkingCellWithRecomendationsUseCase.execute.mockResolvedValue(mockResult);

      await controller.getDashboardData(req, res);

      expect(mockGetParkingCellWithRecomendationsUseCase.execute).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle empty data', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        parkingSpaces: [],
        recommendations: []
      };

      mockGetParkingCellWithRecomendationsUseCase.execute.mockResolvedValue(mockResult);

      await controller.getDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle errors', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockGetParkingCellWithRecomendationsUseCase.execute.mockRejectedValue(new Error('Database error'));

      await controller.getDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error'
      });
    });

    it('should handle complex dashboard data', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        parkingSpaces: [
          {
            id: 'cell1',
            idStatic: 1,
            state: 'reservado',
            reservationDetails: {
              reservedBy: 'user123',
              startTime: '2023-01-01T10:00:00Z',
              endTime: '2023-01-01T11:00:00Z',
              reason: 'Meeting'
            }
          },
          {
            id: 'cell2',
            idStatic: 2,
            state: 'disponible',
            reservationDetails: null
          }
        ],
        recommendations: [
          {
            id: '1',
            message: 'Consider reserving early',
            priority: 'high',
            type: 'availability'
          },
          {
            id: '2',
            message: 'Parking is limited today',
            priority: 'medium',
            type: 'capacity'
          }
        ]
      };

      mockGetParkingCellWithRecomendationsUseCase.execute.mockResolvedValue(mockResult);

      await controller.getDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });
});
