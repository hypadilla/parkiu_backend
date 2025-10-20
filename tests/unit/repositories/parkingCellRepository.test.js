const ParkingCellRepository = require('../../../src/infrastructure/repositories/parkingCellRepository');
const ParkingCell = require('../../../src/core/domain/parkingCell');

// Mock Firebase
const mockFirebase = {
  collection: jest.fn(() => ({
    get: jest.fn(),
    doc: jest.fn(() => ({
      set: jest.fn()
    }))
  })),
  batch: jest.fn(() => ({
    update: jest.fn(),
    commit: jest.fn().mockResolvedValue()
  }))
};

jest.mock('../../../src/infrastructure/database/firebaseService', () => mockFirebase);

describe('ParkingCellRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new ParkingCellRepository();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all parking cells', async () => {
      const mockCells = [
        { id: 'cell1', idStatic: 1, state: 'disponible' },
        { id: 'cell2', idStatic: 2, state: 'ocupado' }
      ];

      const mockDocs = mockCells.map(cell => ({
        data: () => cell,
        id: cell.id
      }));

      const mockQuerySnapshot = {
        empty: false,
        docs: mockDocs
      };

      mockFirebase.collection().get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getAll();

      expect(mockFirebase.collection).toHaveBeenCalledWith('parkingCells');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 'cell1', ...mockCells[0] });
      expect(result[1]).toEqual({ id: 'cell2', ...mockCells[1] });
    });

    it('should return empty array when no cells exist', async () => {
      const mockQuerySnapshot = {
        empty: true,
        docs: []
      };

      mockFirebase.collection().get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getAll();

      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      mockFirebase.collection().get.mockRejectedValue(new Error('Database error'));

      await expect(repository.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('upsert', () => {
    it('should upsert parking cell successfully', async () => {
      const cellData = {
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null
      };

      const mockDoc = {
        id: 'cell1',
        set: jest.fn().mockResolvedValue()
      };

      mockFirebase.collection().doc.mockReturnValue(mockDoc);

      const result = await repository.upsert(cellData);

      expect(mockFirebase.collection).toHaveBeenCalledWith('parkingCells');
      expect(mockDoc.set).toHaveBeenCalledWith(cellData);
      expect(result).toEqual({ id: 'cell1', ...cellData });
    });

    it('should handle upsert errors', async () => {
      const cellData = {
        id: 'cell1',
        idStatic: 1,
        state: 'disponible'
      };

      const mockDoc = {
        id: 'cell1',
        set: jest.fn().mockRejectedValue(new Error('Upsert error'))
      };

      mockFirebase.collection().doc.mockReturnValue(mockDoc);

      await expect(repository.upsert(cellData)).rejects.toThrow('Upsert error');
    });
  });

  describe('bulkUpdate', () => {
    it('should bulk update parking cells successfully', async () => {
      const updates = [
        { id: 'cell1', state: 'ocupado' },
        { id: 'cell2', state: 'disponible' }
      ];

      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn().mockResolvedValue()
      };

      mockFirebase.batch.mockReturnValue(mockBatch);
      mockFirebase.collection().doc.mockReturnValue({});

      const result = await repository.bulkUpdate(updates);

      expect(mockFirebase.collection).toHaveBeenCalledWith('parkingCells');
      expect(mockBatch.commit).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle bulk update errors', async () => {
      const updates = [
        { id: 'cell1', state: 'ocupado' }
      ];

      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn().mockRejectedValue(new Error('Bulk update error'))
      };

      mockFirebase.batch.mockReturnValue(mockBatch);
      mockFirebase.collection().doc.mockReturnValue({});

      await expect(repository.bulkUpdate(updates)).rejects.toThrow('Bulk update error');
    });
  });
});
