const BulkStatusUpdateHandler = require('../../../src/core/services/features/parkingCell/command/bulkStatusUpdate/bulkStatusUpdateHandler');

describe('BulkStatusUpdateHandler', () => {
  let mockParkingCellRepository;
  let handler;

  beforeEach(() => {
    mockParkingCellRepository = {
      bulkUpdate: jest.fn()
    };
    handler = new BulkStatusUpdateHandler(mockParkingCellRepository);
  });

  describe('handle', () => {
    it('should bulk update parking cells successfully', async () => {
      const command = {
        updates: [
          { id: 'cell1', state: 'ocupado' },
          { id: 'cell2', state: 'disponible' },
          { id: 'cell3', state: 'inhabilitado' }
        ]
      };

      const mockResult = { success: true, updated: 3 };
      mockParkingCellRepository.bulkUpdate.mockResolvedValue(mockResult);

      const result = await handler.handle(command);

      expect(mockParkingCellRepository.bulkUpdate).toHaveBeenCalledWith(command.updates);
      expect(result).toEqual(mockResult);
    });

    it('should handle empty updates array', async () => {
      const command = {
        updates: []
      };

      const mockResult = { success: true, updated: 0 };
      mockParkingCellRepository.bulkUpdate.mockResolvedValue(mockResult);

      const result = await handler.handle(command);

      expect(mockParkingCellRepository.bulkUpdate).toHaveBeenCalledWith([]);
      expect(result).toEqual(mockResult);
    });

    it('should handle single update', async () => {
      const command = {
        updates: [
          { id: 'cell1', state: 'ocupado' }
        ]
      };

      const mockResult = { success: true, updated: 1 };
      mockParkingCellRepository.bulkUpdate.mockResolvedValue(mockResult);

      const result = await handler.handle(command);

      expect(mockParkingCellRepository.bulkUpdate).toHaveBeenCalledWith([{ id: 'cell1', state: 'ocupado' }]);
      expect(result).toEqual(mockResult);
    });

    it('should handle repository errors', async () => {
      const command = {
        updates: [
          { id: 'cell1', state: 'ocupado' }
        ]
      };

      mockParkingCellRepository.bulkUpdate.mockRejectedValue(new Error('Bulk update error'));

      await expect(handler.handle(command)).rejects.toThrow('Bulk update error');
    });

    it('should handle large batch updates', async () => {
      const updates = Array(100).fill().map((_, i) => ({
        id: `cell${i}`,
        state: i % 2 === 0 ? 'disponible' : 'ocupado'
      }));

      const command = { updates };

      const mockResult = { success: true, updated: 100 };
      mockParkingCellRepository.bulkUpdate.mockResolvedValue(mockResult);

      const result = await handler.handle(command);

      expect(mockParkingCellRepository.bulkUpdate).toHaveBeenCalledWith(updates);
      expect(result).toEqual(mockResult);
    });
  });
});
