const GetRecommendationsHandler = require('../../../src/core/services/features/recommendations/queries/getRecommendations/getRecommendationsHandler');

describe('GetRecommendationsHandler', () => {
  let mockRecommendationRepository;
  let handler;

  beforeEach(() => {
    mockRecommendationRepository = {
      getRecommendations: jest.fn()
    };
    handler = new GetRecommendationsHandler(mockRecommendationRepository);
  });

  describe('handle', () => {
    it('should return recommendations successfully', async () => {
      const query = {};
      const mockRecommendations = [
        { id: '1', message: 'Recommendation 1', priority: 'high', type: 'availability' },
        { id: '2', message: 'Recommendation 2', priority: 'medium', type: 'capacity' }
      ];

      mockRecommendationRepository.getRecommendations.mockResolvedValue(mockRecommendations);

      const result = await handler.handle(query);

      expect(mockRecommendationRepository.getRecommendations).toHaveBeenCalled();
      expect(result).toEqual(mockRecommendations);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no recommendations exist', async () => {
      const query = {};

      mockRecommendationRepository.getRecommendations.mockResolvedValue([]);

      const result = await handler.handle(query);

      expect(mockRecommendationRepository.getRecommendations).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle repository errors', async () => {
      const query = {};

      mockRecommendationRepository.getRecommendations.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });

    it('should handle complex recommendations', async () => {
      const query = {};
      const mockRecommendations = [
        {
          id: '1',
          message: 'Consider reserving early due to high demand',
          priority: 'high',
          type: 'availability',
          metadata: { demandLevel: 'high', timeSlot: 'morning' }
        },
        {
          id: '2',
          message: 'Parking is limited today',
          priority: 'medium',
          type: 'capacity',
          metadata: { availableSpots: 5, totalSpots: 20 }
        }
      ];

      mockRecommendationRepository.getRecommendations.mockResolvedValue(mockRecommendations);

      const result = await handler.handle(query);

      expect(result).toHaveLength(2);
      expect(result[0].priority).toBe('high');
      expect(result[0].metadata).toBeDefined();
      expect(result[1].type).toBe('capacity');
    });
  });
});
