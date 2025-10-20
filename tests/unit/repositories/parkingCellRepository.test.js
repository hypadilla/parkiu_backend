const ParkingCellRepository = require('../../../src/infrastructure/repositories/parkingCellRepository');
const ParkingCellDomain = require('../../../src/core/domain/parkingCell');
const ReservationDetails = require('../../../src/core/domain/reservationDetails');
const ParkingCellMapper = require('../../../src/core/services/mapping/parkingCellMapper');

// Mock the ParkingCell model
const mockParkingCellInstance = {
  save: jest.fn(),
  toObject: jest.fn()
};

jest.mock('../../../src/infrastructure/database/models/ParkingCell', () => {
  const mockConstructor = jest.fn(() => mockParkingCellInstance);
  mockConstructor.find = jest.fn().mockReturnThis();
  mockConstructor.findById = jest.fn();
  mockConstructor.findOne = jest.fn();
  mockConstructor.findOneAndUpdate = jest.fn();
  mockConstructor.updateMany = jest.fn();
  mockConstructor.bulkWrite = jest.fn();
  mockConstructor.countDocuments = jest.fn();
  mockConstructor.lean = jest.fn();
  mockConstructor.sort = jest.fn().mockReturnThis();
  mockConstructor.limit = jest.fn().mockReturnThis();
  return mockConstructor;
});

const ParkingCell = require('../../../src/infrastructure/database/models/ParkingCell');

describe('ParkingCellRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new ParkingCellRepository();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all parking cells', async () => {
      const mockCells = [
        { _id: '507f1f77bcf86cd799439011', idStatic: 1, state: 'disponible' },
        { _id: '507f1f77bcf86cd799439012', idStatic: 2, state: 'ocupado' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCells)
      };

      ParkingCell.find.mockReturnValue(mockQuery);

      const result = await repository.getAll();

      expect(ParkingCell.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        idStatic: 1,
        state: 'disponible'
      }));
    });

    it('should return empty array when no cells exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };

      ParkingCell.find.mockReturnValue(mockQuery);

      const result = await repository.getAll();

      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      ParkingCell.find.mockReturnValue(mockQuery);

      await expect(repository.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('getByIdStatic', () => {
    it('should return cell when found', async () => {
      const mockCellData = {
        _id: '507f1f77bcf86cd799439011',
        idStatic: 1,
        state: 'disponible'
      };

      ParkingCell.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCellData)
      });

      const result = await repository.getByIdStatic(1);

      expect(ParkingCell.findOne).toHaveBeenCalledWith({ idStatic: 1 });
      expect(result).toEqual(expect.objectContaining({
        idStatic: 1,
        state: 'disponible'
      }));
    });

    it('should return null when cell not found', async () => {
      ParkingCell.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const result = await repository.getByIdStatic(999);

      expect(result).toBeNull();
    });
  });

  describe('upsertByStaticId', () => {
    it('should upsert parking cell successfully', async () => {
      const idStatic = 1;
      const newState = 'ocupado';
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000); // 1 hora después
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: startTime,
        endTime: endTime,
        reason: 'Meeting'
      });

      const mockUpsertedCell = {
        _id: '507f1f77bcf86cd799439011',
        idStatic,
        state: newState,
        reservationDetails
      };

      ParkingCell.findOneAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUpsertedCell)
      });

      const result = await repository.upsertByStaticId(idStatic, newState, reservationDetails);

      expect(ParkingCell.findOneAndUpdate).toHaveBeenCalledWith(
        { idStatic },
        {
          state: newState,
          lastModifiedDate: expect.any(Date),
          lastModifiedBy: 'system'
        },
        {
          upsert: true,
          new: true,
          runValidators: true
        }
      );
      expect(result).toBe('507f1f77bcf86cd799439011');
    });

    it('should handle upsert errors', async () => {
      ParkingCell.findOneAndUpdate.mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error('Upsert error'))
      });

      await expect(repository.upsertByStaticId(1, 'ocupado')).rejects.toThrow('Upsert error');
    });
  });

  describe('bulkStatusUpdate', () => {
    it('should bulk update parking cells successfully', async () => {
      const cells = [
        { idStatic: 1, state: 'ocupado' },
        { idStatic: 2, state: 'disponible' }
      ];

      const mockBulkResult = {
        upsertedIds: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
      };

      ParkingCell.bulkWrite.mockResolvedValue(mockBulkResult);

      const result = await repository.bulkStatusUpdate(cells);

      expect(ParkingCell.bulkWrite).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        idStatic: 1,
        status: 'success',
        docId: '507f1f77bcf86cd799439011'
      });
    });

    it('should handle bulk update errors', async () => {
      const cells = [{ idStatic: 1, state: 'invalid_state' }];

      ParkingCell.bulkWrite.mockRejectedValue(new Error('Bulk update error'));

      await expect(repository.bulkStatusUpdate(cells)).rejects.toThrow('Bulk update error');
    });
  });

  describe('getByState', () => {
    it('should return cells by state', async () => {
      const mockCells = [
        { _id: '507f1f77bcf86cd799439011', idStatic: 1, state: 'disponible' },
        { _id: '507f1f77bcf86cd799439012', idStatic: 2, state: 'disponible' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCells)
      };

      ParkingCell.find.mockReturnValue(mockQuery);

      const result = await repository.getByState('disponible');

      expect(ParkingCell.find).toHaveBeenCalledWith({ state: 'disponible' });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        idStatic: 1,
        state: 'disponible'
      }));
    });
  });

  describe('getReservedByUser', () => {
    it('should return cells reserved by user', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000); // 1 hora después
      const mockCells = [
        { 
          _id: '507f1f77bcf86cd799439011', 
          idStatic: 1, 
          state: 'reservado',
          reservationDetails: {
            reservedBy: 'user123',
            startTime: startTime,
            endTime: endTime,
            reason: 'Meeting'
          }
        }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCells)
      };

      ParkingCell.find.mockReturnValue(mockQuery);

      const result = await repository.getReservedByUser('user123');

      expect(ParkingCell.find).toHaveBeenCalledWith({
        state: 'reservado',
        'reservationDetails.reservedBy': 'user123'
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('countByState', () => {
    it('should return count by state', async () => {
      ParkingCell.countDocuments.mockResolvedValue(5);

      const result = await repository.countByState('disponible');

      expect(ParkingCell.countDocuments).toHaveBeenCalledWith({ state: 'disponible' });
      expect(result).toBe(5);
    });
  });

  describe('getAvailableCells', () => {
    it('should return available cells', async () => {
      const mockCells = [
        { _id: '507f1f77bcf86cd799439011', idStatic: 1, state: 'disponible' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCells)
      };

      ParkingCell.find.mockReturnValue(mockQuery);

      const result = await repository.getAvailableCells();

      expect(ParkingCell.find).toHaveBeenCalledWith({ state: 'disponible' });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({
        idStatic: 1,
        state: 'disponible'
      }));
    });
  });
});