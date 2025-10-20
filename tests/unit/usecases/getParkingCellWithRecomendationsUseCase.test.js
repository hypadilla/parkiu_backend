const GetParkingCellWithRecomendationsUseCase = require('../../../src/core/usecases/getParkingCellWithRecomendationsUseCase');
const ParkingCell = require('../../../src/core/domain/parkingCell');

describe('GetParkingCellWithRecomendationsUseCase', () => {
  let mockGetAllParkingCellHandler;
  let mockGetRecommendationsHandler;
  let useCase;

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
  });

  describe('execute', () => {
    it('should return parking cells and recommendations', async () => {
      const mockParkingCells = [
        new ParkingCell({
          id: 'cell1',
          idStatic: 1,
          state: 'disponible',
          reservationDetails: null
        }),
        new ParkingCell({
          id: 'cell2',
          idStatic: 2,
          state: 'ocupado',
          reservationDetails: null
        })
      ];

      const mockRecommendations = [
        { id: '1', message: 'Recommendation 1', priority: 'high' },
        { id: '2', message: 'Recommendation 2', priority: 'medium' }
      ];

      mockGetAllParkingCellHandler.handle.mockResolvedValue(mockParkingCells);
      mockGetRecommendationsHandler.handle.mockResolvedValue(mockRecommendations);

      const result = await useCase.execute();

      expect(mockGetAllParkingCellHandler.handle).toHaveBeenCalled();
      expect(mockGetRecommendationsHandler.handle).toHaveBeenCalled();
      expect(result).toEqual({
        parkingSpaces: mockParkingCells,
        recommendations: mockRecommendations
      });
    });

    it('should return empty arrays when no data available', async () => {
      mockGetAllParkingCellHandler.handle.mockResolvedValue([]);
      mockGetRecommendationsHandler.handle.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual({
        parkingSpaces: [],
        recommendations: []
      });
    });

    it('should handle parking cell handler errors', async () => {
      mockGetAllParkingCellHandler.handle.mockRejectedValue(new Error('Parking cell error'));
      mockGetRecommendationsHandler.handle.mockResolvedValue([]);

      await expect(useCase.execute()).rejects.toThrow('Parking cell error');
    });

    it('should handle recommendations handler errors', async () => {
      const mockParkingCells = [
        new ParkingCell({
          id: 'cell1',
          idStatic: 1,
          state: 'disponible'
        })
      ];

      mockGetAllParkingCellHandler.handle.mockResolvedValue(mockParkingCells);
      mockGetRecommendationsHandler.handle.mockRejectedValue(new Error('Recommendations error'));

      await expect(useCase.execute()).rejects.toThrow('Recommendations error');
    });

    it('should handle both handlers with complex data', async () => {
      const ReservationDetails = require('../../../src/core/domain/reservationDetails');
      
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Meeting'
      });

      const mockParkingCells = [
        new ParkingCell({
          id: 'cell1',
          idStatic: 1,
          state: 'reservado',
          reservationDetails: reservationDetails
        }),
        new ParkingCell({
          id: 'cell2',
          idStatic: 2,
          state: 'disponible',
          reservationDetails: null
        })
      ];

      const mockRecommendations = [
        { id: '1', message: 'Consider reserving early', priority: 'high', type: 'availability' },
        { id: '2', message: 'Parking is limited today', priority: 'medium', type: 'capacity' }
      ];

      mockGetAllParkingCellHandler.handle.mockResolvedValue(mockParkingCells);
      mockGetRecommendationsHandler.handle.mockResolvedValue(mockRecommendations);

      const result = await useCase.execute();

      expect(result.parkingSpaces).toHaveLength(2);
      expect(result.recommendations).toHaveLength(2);
      expect(result.parkingSpaces[0].state).toBe('reservado');
      expect(result.parkingSpaces[0].reservationDetails).toBeInstanceOf(ReservationDetails);
      expect(result.recommendations[0].priority).toBe('high');
    });
  });
});
