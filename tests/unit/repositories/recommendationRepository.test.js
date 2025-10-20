const RecommendationRepository = require('../../../src/infrastructure/repositories/recommendationRepository');

// Mock the Recommendation model
const mockRecommendationInstance = {
  save: jest.fn(),
  toObject: jest.fn()
};

jest.mock('../../../src/infrastructure/database/models/Recommendation', () => {
  const mockConstructor = jest.fn(() => mockRecommendationInstance);
  mockConstructor.find = jest.fn().mockReturnThis();
  mockConstructor.findById = jest.fn();
  mockConstructor.findOne = jest.fn();
  mockConstructor.create = jest.fn();
  mockConstructor.findByIdAndUpdate = jest.fn();
  mockConstructor.findByIdAndDelete = jest.fn();
  mockConstructor.updateMany = jest.fn();
  mockConstructor.countDocuments = jest.fn();
  mockConstructor.lean = jest.fn();
  mockConstructor.sort = jest.fn().mockReturnThis();
  mockConstructor.limit = jest.fn().mockReturnThis();
  return mockConstructor;
});

const Recommendation = require('../../../src/infrastructure/database/models/Recommendation');

describe('RecommendationRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new RecommendationRepository();
    jest.clearAllMocks();
  });

  describe('getRecommendations', () => {
    it('should return recommendations successfully', async () => {
      const mockRecommendations = [
        {
          _id: '507f1f77bcf86cd799439011',
          message: 'Recommendation 1',
          priority: 'high',
          type: 'availability',
          isActive: true
        },
        {
          _id: '507f1f77bcf86cd799439012',
          message: 'Recommendation 2',
          priority: 'medium',
          type: 'capacity',
          isActive: true
        }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRecommendations)
      };

      Recommendation.find.mockReturnValue(mockQuery);

      const result = await repository.getRecommendations();

      expect(Recommendation.find).toHaveBeenCalledWith({
        isActive: true,
        expiresAt: { $gt: expect.any(Date) }
      });
      expect(result).toHaveLength(2);
      expect(result[0].message).toBe('Recommendation 1');
    });

    it('should return empty array when no recommendations exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };

      Recommendation.find.mockReturnValue(mockQuery);

      const result = await repository.getRecommendations();

      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      Recommendation.find.mockReturnValue(mockQuery);

      await expect(repository.getRecommendations()).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create recommendation successfully', async () => {
      const recommendationData = {
        message: 'New recommendation',
        priority: 'high',
        type: 'availability'
      };

      const mockCreatedRecommendation = {
        _id: '507f1f77bcf86cd799439011',
        ...recommendationData,
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439011',
          ...recommendationData
        })
      };

      mockRecommendationInstance.save.mockResolvedValue(mockCreatedRecommendation);

      const result = await repository.create(recommendationData);

      expect(Recommendation).toHaveBeenCalledWith(recommendationData);
      expect(mockRecommendationInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedRecommendation.toObject());
    });

    it('should handle create errors', async () => {
      const recommendationData = {
        message: 'New recommendation'
        // Missing required fields
      };

      mockRecommendationInstance.save.mockRejectedValue(new Error('Validation error'));

      await expect(repository.create(recommendationData)).rejects.toThrow('Error creando recomendación: Validation error');
    });
  });

  describe('getById', () => {
    it('should return recommendation when found', async () => {
      const mockRecommendation = {
        _id: '507f1f77bcf86cd799439011',
        message: 'Test recommendation'
      };

      Recommendation.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockRecommendation)
      });

      const result = await repository.getById('507f1f77bcf86cd799439011');

      expect(Recommendation.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockRecommendation);
    });

    it('should return null when recommendation not found', async () => {
      Recommendation.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const result = await repository.getById('507f1f77bcf86cd799439011');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update recommendation successfully', async () => {
      const updateData = {
        message: 'Updated recommendation',
        priority: 'low'
      };

      const mockUpdatedRecommendation = {
        _id: '507f1f77bcf86cd799439011',
        ...updateData
      };

      Recommendation.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUpdatedRecommendation)
      });

      const result = await repository.update('507f1f77bcf86cd799439011', updateData);

      expect(Recommendation.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { ...updateData, lastModifiedDate: expect.any(Date) },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUpdatedRecommendation);
    });

    it('should throw error when recommendation not found', async () => {
      Recommendation.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      await expect(repository.update('507f1f77bcf86cd799439011', { message: 'Updated' }))
        .rejects.toThrow('Recomendación no encontrada');
    });
  });

  describe('delete', () => {
    it('should delete recommendation successfully', async () => {
      const mockDeletedRecommendation = {
        _id: '507f1f77bcf86cd799439011',
        message: 'Test recommendation'
      };

      Recommendation.findByIdAndDelete.mockResolvedValue(mockDeletedRecommendation);

      const result = await repository.delete('507f1f77bcf86cd799439011');

      expect(Recommendation.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toBe(true);
    });

    it('should throw error when recommendation not found', async () => {
      Recommendation.findByIdAndDelete.mockResolvedValue(null);

      await expect(repository.delete('507f1f77bcf86cd799439011'))
        .rejects.toThrow('Recomendación no encontrada');
    });
  });

  describe('getByPriority', () => {
    it('should return recommendations by priority', async () => {
      const mockRecommendations = [
        { _id: '507f1f77bcf86cd799439011', message: 'High priority', priority: 'high' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRecommendations)
      };

      Recommendation.find.mockReturnValue(mockQuery);

      const result = await repository.getByPriority('high');

      expect(Recommendation.find).toHaveBeenCalledWith({
        priority: 'high',
        isActive: true,
        expiresAt: { $gt: expect.any(Date) }
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('getByType', () => {
    it('should return recommendations by type', async () => {
      const mockRecommendations = [
        { _id: '507f1f77bcf86cd799439011', message: 'Availability', type: 'availability' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRecommendations)
      };

      Recommendation.find.mockReturnValue(mockQuery);

      const result = await repository.getByType('availability');

      expect(Recommendation.find).toHaveBeenCalledWith({
        type: 'availability',
        isActive: true,
        expiresAt: { $gt: expect.any(Date) }
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('deactivateExpired', () => {
    it('should deactivate expired recommendations', async () => {
      const mockResult = { modifiedCount: 3 };

      Recommendation.updateMany.mockResolvedValue(mockResult);

      const result = await repository.deactivateExpired();

      expect(Recommendation.updateMany).toHaveBeenCalledWith(
        {
          isActive: true,
          expiresAt: { $lte: expect.any(Date) }
        },
        { isActive: false }
      );
      expect(result).toBe(3);
    });
  });

  describe('count', () => {
    it('should return count of active recommendations', async () => {
      Recommendation.countDocuments.mockResolvedValue(5);

      const result = await repository.count();

      expect(Recommendation.countDocuments).toHaveBeenCalledWith({
        isActive: true,
        expiresAt: { $gt: expect.any(Date) }
      });
      expect(result).toBe(5);
    });
  });

  describe('getAll', () => {
    it('should return all recommendations', async () => {
      const mockRecommendations = [
        { _id: '507f1f77bcf86cd799439011', message: 'Recommendation 1' },
        { _id: '507f1f77bcf86cd799439012', message: 'Recommendation 2' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRecommendations)
      };

      Recommendation.find.mockReturnValue(mockQuery);

      const result = await repository.getAll();

      expect(Recommendation.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });
});