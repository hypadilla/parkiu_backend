const BulkStatusUpdateHandler = require('../../../src/core/services/features/parkingCell/command/bulkStatusUpdate/bulkStatusUpdateHandler');

describe('BulkStatusUpdateHandler', () => {
  let handler;
  let mockParkingCellRepository;

  beforeEach(() => {
    mockParkingCellRepository = {
      bulkStatusUpdate: jest.fn()
    };
    handler = new BulkStatusUpdateHandler(mockParkingCellRepository);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should process bulk status update successfully', async () => {
      const data = {
        data: {
          sectores: [
            {
              celdas: {
                '1': 'ocupado',
                '2': 'disponible',
                '3': 'reservado'
              }
            },
            {
              celdas: {
                '4': 'inhabilitado',
                '5': 'disponible'
              }
            }
          ]
        }
      };

      mockParkingCellRepository.bulkStatusUpdate.mockResolvedValue();

      await handler.handle(data);

      expect(mockParkingCellRepository.bulkStatusUpdate).toHaveBeenCalledWith([
        { idStatic: 1, state: 'ocupado' },
        { idStatic: 2, state: 'disponible' },
        { idStatic: 3, state: 'reservado' },
        { idStatic: 4, state: 'inhabilitado' },
        { idStatic: 5, state: 'disponible' }
      ]);
    });

    it('should handle empty sectores', async () => {
      const data = {
        data: {
          sectores: []
        }
      };

      mockParkingCellRepository.bulkStatusUpdate.mockResolvedValue();

      await handler.handle(data);

      expect(mockParkingCellRepository.bulkStatusUpdate).toHaveBeenCalledWith([]);
    });

    it('should handle empty celdas in sector', async () => {
      const data = {
        data: {
          sectores: [
            {
              celdas: {}
            }
          ]
        }
      };

      mockParkingCellRepository.bulkStatusUpdate.mockResolvedValue();

      await handler.handle(data);

      expect(mockParkingCellRepository.bulkStatusUpdate).toHaveBeenCalledWith([]);
    });

    it('should handle repository errors', async () => {
      const data = {
        data: {
          sectores: [
            {
              celdas: {
                '1': 'ocupado'
              }
            }
          ]
        }
      };

      mockParkingCellRepository.bulkStatusUpdate.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(data)).rejects.toThrow('Database error');
    });

    it('should handle invalid idStatic values', async () => {
      const data = {
        data: {
          sectores: [
            {
              celdas: {
                'invalid': 'ocupado',
                '1.5': 'disponible'
              }
            }
          ]
        }
      };

      mockParkingCellRepository.bulkStatusUpdate.mockResolvedValue();

      await handler.handle(data);

      const callArgs = mockParkingCellRepository.bulkStatusUpdate.mock.calls[0][0];
      expect(callArgs).toHaveLength(2);
      expect(callArgs[0]).toEqual(expect.objectContaining({
        idStatic: expect.any(Number),
        state: 'ocupado'
      }));
      expect(callArgs[1]).toEqual({
        idStatic: 1,
        state: 'disponible'
      });
      expect(isNaN(callArgs[0].idStatic)).toBe(true);
    });

    it('should handle multiple sectores with same cell IDs', async () => {
      const data = {
        data: {
          sectores: [
            {
              celdas: {
                '1': 'ocupado'
              }
            },
            {
              celdas: {
                '1': 'disponible' // Same ID, should be processed
              }
            }
          ]
        }
      };

      mockParkingCellRepository.bulkStatusUpdate.mockResolvedValue();

      await handler.handle(data);

      expect(mockParkingCellRepository.bulkStatusUpdate).toHaveBeenCalledWith([
        { idStatic: 1, state: 'ocupado' },
        { idStatic: 1, state: 'disponible' }
      ]);
    });
  });
});