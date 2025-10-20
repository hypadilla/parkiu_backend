const HistoricalRecordRepository = require('../../../src/infrastructure/repositories/historicalRecordRepository');

// Mock the HistoricalRecord model
const mockHistoricalRecordInstance = {
  save: jest.fn(),
  toObject: jest.fn()
};

jest.mock('../../../src/infrastructure/database/models/HistoricalRecord', () => {
  const mockConstructor = jest.fn(() => mockHistoricalRecordInstance);
  mockConstructor.find = jest.fn().mockReturnThis();
  mockConstructor.findById = jest.fn();
  mockConstructor.findOne = jest.fn();
  mockConstructor.create = jest.fn();
  mockConstructor.findByIdAndUpdate = jest.fn();
  mockConstructor.findByIdAndDelete = jest.fn();
  mockConstructor.updateMany = jest.fn();
  mockConstructor.deleteMany = jest.fn();
  mockConstructor.countDocuments = jest.fn();
  mockConstructor.lean = jest.fn();
  mockConstructor.sort = jest.fn().mockReturnThis();
  mockConstructor.limit = jest.fn().mockReturnThis();
  return mockConstructor;
});

const HistoricalRecord = require('../../../src/infrastructure/database/models/HistoricalRecord');

describe('HistoricalRecordRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new HistoricalRecordRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create historical record successfully', async () => {
      const recordData = {
        parkingCellId: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'ocupado',
        eventType: 'entrada',
        details: { vehiclePlate: 'ABC-123' }
      };

      const mockCreatedRecord = {
        _id: '507f1f77bcf86cd799439011',
        ...recordData,
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439011',
          ...recordData
        })
      };

      mockHistoricalRecordInstance.save.mockResolvedValue(mockCreatedRecord);

      const result = await repository.create(recordData);

      expect(HistoricalRecord).toHaveBeenCalledWith(recordData);
      expect(mockHistoricalRecordInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedRecord.toObject());
    });

    it('should handle create errors', async () => {
      const recordData = {
        parkingCellId: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'ocupado',
        eventType: 'entrada'
        // Missing required fields
      };

      mockHistoricalRecordInstance.save.mockRejectedValue(new Error('Validation error'));

      await expect(repository.create(recordData)).rejects.toThrow('Error creando registro histórico: Validation error');
    });
  });

  describe('getByCellId', () => {
    it('should return records by cell id', async () => {
      const mockRecords = [
        { _id: '1', id: '507f1f77bcf86cd799439011', state: 'ocupado' },
        { _id: '2', id: '507f1f77bcf86cd799439011', state: 'disponible' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRecords)
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      const result = await repository.getByCellId('507f1f77bcf86cd799439011');

      expect(HistoricalRecord.find).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439011' });
      expect(result).toEqual(mockRecords);
    });

    it('should return empty array when no records exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      const result = await repository.getByCellId('507f1f77bcf86cd799439011');

      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      await expect(repository.getByCellId('507f1f77bcf86cd799439011')).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should return record by id', async () => {
      const mockRecord = { _id: '1', state: 'ocupado' };

      HistoricalRecord.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockRecord)
      });

      const result = await repository.getById('1');

      expect(HistoricalRecord.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockRecord);
    });

    it('should return null when record not found', async () => {
      HistoricalRecord.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const result = await repository.getById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      HistoricalRecord.findById.mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await expect(repository.getById('1')).rejects.toThrow('Database error');
    });
  });

  describe('getByStatus', () => {
    it('should return records by status', async () => {
      const mockRecords = [
        { _id: '1', status: 'ocupado', state: 'ocupado' },
        { _id: '2', status: 'ocupado', state: 'ocupado' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRecords)
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      const result = await repository.getByStatus('ocupado');

      expect(HistoricalRecord.find).toHaveBeenCalledWith({ status: 'ocupado' });
      expect(result).toEqual(mockRecords);
    });

    it('should return empty array when no records exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      const result = await repository.getByStatus('ocupado');

      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      await expect(repository.getByStatus('ocupado')).rejects.toThrow('Database error');
    });
  });

  describe('getByDateRange', () => {
    it('should return records by date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const mockRecords = [
        { _id: '1', timestamp: new Date('2024-01-15'), state: 'ocupado' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRecords)
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      const result = await repository.getByDateRange(startDate, endDate);

      expect(HistoricalRecord.find).toHaveBeenCalledWith({
        startTime: {
          $gte: startDate,
          $lte: endDate
        }
      });
      expect(result).toEqual(mockRecords);
    });

    it('should return empty array when no records exist', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      const result = await repository.getByDateRange(startDate, endDate);

      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      await expect(repository.getByDateRange(startDate, endDate)).rejects.toThrow('Database error');
    });
  });

  describe('getAll', () => {
    it('should return all records', async () => {
      const mockRecords = [
        { _id: '1', state: 'ocupado' },
        { _id: '2', state: 'disponible' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockRecords)
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      const result = await repository.getAll();

      expect(HistoricalRecord.find).toHaveBeenCalled();
      expect(result).toEqual(mockRecords);
    });

    it('should return empty array when no records exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      const result = await repository.getAll();

      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      HistoricalRecord.find.mockReturnValue(mockQuery);

      await expect(repository.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('count', () => {
    it('should return count of records', async () => {
      HistoricalRecord.countDocuments.mockResolvedValue(10);

      const result = await repository.count();

      expect(HistoricalRecord.countDocuments).toHaveBeenCalled();
      expect(result).toBe(10);
    });

    it('should handle database errors', async () => {
      HistoricalRecord.countDocuments.mockRejectedValue(new Error('Database error'));

      await expect(repository.count()).rejects.toThrow('Database error');
    });
  });

  describe('deleteOldRecords', () => {
    it('should delete old records', async () => {
      const mockDeleteResult = { deletedCount: 5 };

      HistoricalRecord.deleteMany.mockResolvedValue(mockDeleteResult);

      const result = await repository.deleteOldRecords(90);

      expect(HistoricalRecord.deleteMany).toHaveBeenCalledWith({
        createdDate: { $lt: expect.any(Date) }
      });
      expect(result).toBe(5);
    });

    it('should handle database errors', async () => {
      HistoricalRecord.deleteMany.mockRejectedValue(new Error('Database error'));

      await expect(repository.deleteOldRecords(90)).rejects.toThrow('Database error');
    });
  });
});
