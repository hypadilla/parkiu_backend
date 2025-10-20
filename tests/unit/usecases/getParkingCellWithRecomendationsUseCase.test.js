const GetParkingCellWithRecomendationsUseCase = require('../../../src/core/usecases/getParkingCellWithRecomendationsUseCase');

describe('GetParkingCellWithRecomendationsUseCase', () => {
  let useCase;
  let mockGetAllParkingCellHandler;
  let mockGetRecommendationsHandler;

  beforeEach(() => {
    mockGetAllParkingCellHandler = {
      handle: jest.fn()
    };
    mockGetRecommendationsHandler = {
      handle: jest.fn()
    };
    useCase = new GetParkingCellWithRecomendationsUseCase(
      mockGetAllParkingCellHandler,
      mockGetRecommendationsHandler
    );
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return parking cells and recommendations successfully', async () => {
      const mockParkingCells = [
        { id: '1', idStatic: 1, state: 'disponible' },
        { id: '2', idStatic: 2, state: 'ocupado' }
      ];

      const mockRecommendations = [
        { message: 'Recomendación 1', priority: 'high' },
        { message: 'Recomendación 2', priority: 'medium' }
      ];

      mockGetAllParkingCellHandler.handle.mockResolvedValue(mockParkingCells);
      mockGetRecommendationsHandler.handle.mockResolvedValue(mockRecommendations);

      const result = await useCase.execute();

      expect(mockGetAllParkingCellHandler.handle).toHaveBeenCalled();
      expect(mockGetRecommendationsHandler.handle).toHaveBeenCalled();
      expect(result).toEqual({
        parkingCells: mockParkingCells,
        recommendations: mockRecommendations
      });
    });

    it('should return empty arrays when no data', async () => {
      mockGetAllParkingCellHandler.handle.mockResolvedValue([]);
      mockGetRecommendationsHandler.handle.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual({
        parkingCells: [],
        recommendations: []
      });
    });

    it('should handle parking cell handler errors', async () => {
      mockGetAllParkingCellHandler.handle.mockRejectedValue(new Error('Parking cell error'));
      mockGetRecommendationsHandler.handle.mockResolvedValue([]);

      await expect(useCase.execute()).rejects.toThrow('Parking cell error');
    });

    it('should handle recommendations handler errors', async () => {
      const mockParkingCells = [{ id: '1', idStatic: 1, state: 'disponible' }];
      mockGetAllParkingCellHandler.handle.mockResolvedValue(mockParkingCells);
      mockGetRecommendationsHandler.handle.mockRejectedValue(new Error('Recommendations error'));

      await expect(useCase.execute()).rejects.toThrow('Recommendations error');
    });

    it('should handle both handlers errors', async () => {
      mockGetAllParkingCellHandler.handle.mockRejectedValue(new Error('Parking cell error'));
      mockGetRecommendationsHandler.handle.mockRejectedValue(new Error('Recommendations error'));

      await expect(useCase.execute()).rejects.toThrow('Parking cell error');
    });

    it('should return data with only parking cells', async () => {
      const mockParkingCells = [
        { id: '1', idStatic: 1, state: 'disponible' }
      ];

      mockGetAllParkingCellHandler.handle.mockResolvedValue(mockParkingCells);
      mockGetRecommendationsHandler.handle.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual({
        parkingCells: mockParkingCells,
        recommendations: []
      });
    });

    it('should return data with only recommendations', async () => {
      const mockRecommendations = [
        { message: 'Recomendación 1', priority: 'high' }
      ];

      mockGetAllParkingCellHandler.handle.mockResolvedValue([]);
      mockGetRecommendationsHandler.handle.mockResolvedValue(mockRecommendations);

      const result = await useCase.execute();

      expect(result).toEqual({
        parkingCells: [],
        recommendations: mockRecommendations
      });
    });

    it('should handle large datasets', async () => {
      const largeParkingCells = Array.from({ length: 1000 }, (_, i) => ({
        id: i.toString(),
        idStatic: i + 1,
        state: i % 2 === 0 ? 'disponible' : 'ocupado'
      }));

      const largeRecommendations = Array.from({ length: 100 }, (_, i) => ({
        message: `Recomendación ${i + 1}`,
        priority: 'medium'
      }));

      mockGetAllParkingCellHandler.handle.mockResolvedValue(largeParkingCells);
      mockGetRecommendationsHandler.handle.mockResolvedValue(largeRecommendations);

      const result = await useCase.execute();

      expect(result.parkingCells).toHaveLength(1000);
      expect(result.recommendations).toHaveLength(100);
    });
  });
});