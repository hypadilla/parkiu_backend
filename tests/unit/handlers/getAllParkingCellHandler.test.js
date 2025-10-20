const GetAllParkingCellHandler = require('../../../src/core/services/features/parkingCell/queries/getAllParkingCell/getAllParkingCellHandler');
const ParkingCell = require('../../../src/core/domain/parkingCell');

describe('GetAllParkingCellHandler', () => {
  let mockParkingCellRepository;
  let handler;

  beforeEach(() => {
    mockParkingCellRepository = {
      getAll: jest.fn()
    };
    handler = new GetAllParkingCellHandler(mockParkingCellRepository);
  });

  describe('handle', () => {
    it('should return all parking cells', async () => {
      const query = {};
      const mockCells = [
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

      mockParkingCellRepository.getAll.mockResolvedValue(mockCells);

      const result = await handler.handle(query);

      expect(mockParkingCellRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockCells);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no cells exist', async () => {
      const query = {};

      mockParkingCellRepository.getAll.mockResolvedValue([]);

      const result = await handler.handle(query);

      expect(mockParkingCellRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle repository errors', async () => {
      const query = {};

      mockParkingCellRepository.getAll.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });

    it('should return cells with reservation details', async () => {
      const ReservationDetails = require('../../../src/core/domain/reservationDetails');
      
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Meeting'
      });

      const mockCells = [
        new ParkingCell({
          id: 'cell1',
          idStatic: 1,
          state: 'reservado',
          reservationDetails: reservationDetails
        })
      ];

      mockParkingCellRepository.getAll.mockResolvedValue(mockCells);

      const result = await handler.handle({});

      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('reservado');
      expect(result[0].reservationDetails).toBeInstanceOf(ReservationDetails);
    });

    it('should handle large number of cells', async () => {
      const query = {};
      const mockCells = Array(100).fill().map((_, i) => 
        new ParkingCell({
          id: `cell${i}`,
          idStatic: i,
          state: i % 2 === 0 ? 'disponible' : 'ocupado',
          reservationDetails: null
        })
      );

      mockParkingCellRepository.getAll.mockResolvedValue(mockCells);

      const result = await handler.handle(query);

      expect(result).toHaveLength(100);
      expect(result[0].id).toBe('cell0');
      expect(result[99].id).toBe('cell99');
    });
  });
});