const GetRecommendationsHandler = require('../../../src/core/services/features/recommendations/queries/getRecommendations/getRecommendationsHandler');

describe('GetRecommendationsHandler', () => {
  let handler;
  let mockHistoricalRecordRepository;

  beforeEach(() => {
    mockHistoricalRecordRepository = {
      getAll: jest.fn()
    };
    handler = new GetRecommendationsHandler(mockHistoricalRecordRepository);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return recommendations successfully', async () => {
      const query = {};

      const mockData = [
        {
          startTime: '2024-01-01T08:00:00Z',
          endTime: '2024-01-01T10:00:00Z',
          parkingCellId: '507f1f77bcf86cd799439011'
        },
        {
          startTime: '2024-01-01T09:00:00Z',
          endTime: '2024-01-01T11:00:00Z',
          parkingCellId: '507f1f77bcf86cd799439012'
        }
      ];

      mockHistoricalRecordRepository.getAll.mockResolvedValue(mockData);

      const result = await handler.handle(query);

      expect(mockHistoricalRecordRepository.getAll).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when no recommendations exist', async () => {
      const query = {};

      mockHistoricalRecordRepository.getAll.mockResolvedValue([]);

      const result = await handler.handle(query);

      expect(mockHistoricalRecordRepository.getAll).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should handle repository errors', async () => {
      const query = {};

      mockHistoricalRecordRepository.getAll.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });

    it('should handle complex recommendations', async () => {
      const query = {};

      const mockData = [
        {
          startTime: '2024-01-01T08:00:00Z',
          endTime: '2024-01-01T12:00:00Z',
          parkingCellId: '507f1f77bcf86cd799439011'
        },
        {
          startTime: '2024-01-01T14:00:00Z',
          endTime: '2024-01-01T18:00:00Z',
          parkingCellId: '507f1f77bcf86cd799439012'
        },
        {
          startTime: '2024-01-02T09:00:00Z',
          endTime: '2024-01-02T17:00:00Z',
          parkingCellId: '507f1f77bcf86cd799439013'
        }
      ];

      mockHistoricalRecordRepository.getAll.mockResolvedValue(mockData);

      const result = await handler.handle(query);

      expect(mockHistoricalRecordRepository.getAll).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});