const RecommendationRepository = require('../../../src/infrastructure/repositories/recommendationRepository');

// Mock Firebase
const mockFirebase = {
  collection: jest.fn(() => ({
    get: jest.fn()
  }))
};

jest.mock('../../../src/infrastructure/database/firebaseService', () => mockFirebase);

describe('RecommendationRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new RecommendationRepository();
    jest.clearAllMocks();
  });

  describe('getRecommendations', () => {
    it('should return recommendations successfully', async () => {
      const mockRecommendations = [
        { id: '1', message: 'Recommendation 1', priority: 'high', type: 'availability' },
        { id: '2', message: 'Recommendation 2', priority: 'medium', type: 'capacity' }
      ];

      const mockDocs = mockRecommendations.map(rec => ({
        data: () => rec,
        id: rec.id
      }));

      const mockQuerySnapshot = {
        empty: false,
        docs: mockDocs
      };

      mockFirebase.collection().get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getRecommendations();

      expect(mockFirebase.collection).toHaveBeenCalledWith('recommendations');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1', ...mockRecommendations[0] });
      expect(result[1]).toEqual({ id: '2', ...mockRecommendations[1] });
    });

    it('should return empty array when no recommendations exist', async () => {
      const mockQuerySnapshot = {
        empty: true,
        docs: []
      };

      mockFirebase.collection().get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getRecommendations();

      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      mockFirebase.collection().get.mockRejectedValue(new Error('Database error'));

      await expect(repository.getRecommendations()).rejects.toThrow('Database error');
    });

    it('should handle complex recommendations', async () => {
      const mockRecommendations = [
        {
          id: '1',
          message: 'Consider reserving early due to high demand',
          priority: 'high',
          type: 'availability',
          metadata: { demandLevel: 'high', timeSlot: 'morning' },
          createdAt: new Date('2023-01-01T10:00:00Z'),
          expiresAt: new Date('2023-01-01T18:00:00Z')
        },
        {
          id: '2',
          message: 'Parking is limited today',
          priority: 'medium',
          type: 'capacity',
          metadata: { availableSpots: 5, totalSpots: 20 },
          createdAt: new Date('2023-01-01T09:00:00Z'),
          expiresAt: new Date('2023-01-01T17:00:00Z')
        }
      ];

      const mockDocs = mockRecommendations.map(rec => ({
        data: () => rec,
        id: rec.id
      }));

      const mockQuerySnapshot = {
        empty: false,
        docs: mockDocs
      };

      mockFirebase.collection().get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getRecommendations();

      expect(result).toHaveLength(2);
      expect(result[0].metadata).toBeDefined();
      expect(result[0].metadata.demandLevel).toBe('high');
      expect(result[1].metadata.availableSpots).toBe(5);
    });
  });
});
