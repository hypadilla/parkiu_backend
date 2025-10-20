const DashboardController = require('../../../src/adapters/controllers/dashboardController');

describe('DashboardController', () => {
  let controller;
  let mockGetParkingCellWithRecomendationsUseCase;

  beforeEach(() => {
    mockGetParkingCellWithRecomendationsUseCase = {
      execute: jest.fn()
    };
    controller = new DashboardController(mockGetParkingCellWithRecomendationsUseCase);
    jest.clearAllMocks();
  });

  describe('getDashboardData', () => {
    it('should return dashboard data successfully', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockData = {
        parkingCells: [
          { idStatic: 1, state: 'disponible' },
          { idStatic: 2, state: 'ocupado' },
          { idStatic: 3, state: 'reservado' }
        ],
        recommendations: [
          { message: 'Recomendación 1', priority: 'high' },
          { message: 'Recomendación 2', priority: 'medium' }
        ]
      };

      mockGetParkingCellWithRecomendationsUseCase.execute.mockResolvedValue(mockData);

      await controller.getDashboardData(req, res);

      expect(mockGetParkingCellWithRecomendationsUseCase.execute).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        Parqueaderos: [
          { parquederoid: 1, Estado: 'disponible' },
          { parquederoid: 2, Estado: 'ocupado' },
          { parquederoid: 3, Estado: 'reservado' }
        ],
        Recomendaciones: [
          { message: 'Recomendación 1', priority: 'high' },
          { message: 'Recomendación 2', priority: 'medium' }
        ]
      });
    });

    it('should return empty dashboard data', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockData = {
        parkingCells: [],
        recommendations: []
      };

      mockGetParkingCellWithRecomendationsUseCase.execute.mockResolvedValue(mockData);

      await controller.getDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        Parqueaderos: [],
        Recomendaciones: []
      });
    });

    it('should handle use case errors', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockGetParkingCellWithRecomendationsUseCase.execute.mockRejectedValue(new Error('Database error'));

      await controller.getDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error interno al obtener los datos del dashboard',
        error: 'Database error'
      });
    });

    it('should handle empty parking cells with recommendations', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockData = {
        parkingCells: [],
        recommendations: [
          { message: 'No hay celdas disponibles', priority: 'high' }
        ]
      };

      mockGetParkingCellWithRecomendationsUseCase.execute.mockResolvedValue(mockData);

      await controller.getDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        Parqueaderos: [],
        Recomendaciones: [
          { message: 'No hay celdas disponibles', priority: 'high' }
        ]
      });
    });

    it('should handle parking cells without recommendations', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockData = {
        parkingCells: [
          { idStatic: 1, state: 'disponible' }
        ],
        recommendations: []
      };

      mockGetParkingCellWithRecomendationsUseCase.execute.mockResolvedValue(mockData);

      await controller.getDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        Parqueaderos: [
          { parquederoid: 1, Estado: 'disponible' }
        ],
        Recomendaciones: []
      });
    });
  });
});