const UpsertParkingCellHandler = require('../../../src/core/services/features/parkingCell/command/upsertParkingCell/upsertParkingCellHandler');
const ParkingCell = require('../../../src/core/domain/parkingCell');

describe('UpsertParkingCellHandler', () => {
  let mockParkingCellRepository;
  let handler;

  beforeEach(() => {
    mockParkingCellRepository = {
      upsert: jest.fn()
    };
    handler = new UpsertParkingCellHandler(mockParkingCellRepository);
  });

  describe('handle', () => {
    it('should upsert parking cell successfully', async () => {
      const command = {
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null
      };

      const mockCell = new ParkingCell(command);
      mockParkingCellRepository.upsert.mockResolvedValue(mockCell);

      const result = await handler.handle(command);

      expect(mockParkingCellRepository.upsert).toHaveBeenCalledWith(command);
      expect(result).toBeInstanceOf(ParkingCell);
      expect(result.id).toBe('cell1');
      expect(result.idStatic).toBe(1);
      expect(result.state).toBe('disponible');
    });

    it('should upsert parking cell with reservation details', async () => {
      const ReservationDetails = require('../../../src/core/domain/reservationDetails');
      
      const reservationDetails = new ReservationDetails({
        reservedBy: 'user123',
        startTime: '2023-01-01T10:00:00Z',
        endTime: '2023-01-01T11:00:00Z',
        reason: 'Meeting'
      });

      const command = {
        id: 'cell2',
        idStatic: 2,
        state: 'reservado',
        reservationDetails: reservationDetails
      };

      const mockCell = new ParkingCell(command);
      mockParkingCellRepository.upsert.mockResolvedValue(mockCell);

      const result = await handler.handle(command);

      expect(mockParkingCellRepository.upsert).toHaveBeenCalledWith(command);
      expect(result).toBeInstanceOf(ParkingCell);
      expect(result.state).toBe('reservado');
      expect(result.reservationDetails).toBeInstanceOf(ReservationDetails);
    });

    it('should handle repository errors', async () => {
      const command = {
        id: 'cell1',
        idStatic: 1,
        state: 'disponible'
      };

      mockParkingCellRepository.upsert.mockRejectedValue(new Error('Upsert error'));

      await expect(handler.handle(command)).rejects.toThrow('Upsert error');
    });

    it('should handle invalid command data', async () => {
      const command = {
        id: 'cell1',
        idStatic: 1,
        state: 'invalid_state'
      };

      mockParkingCellRepository.upsert.mockRejectedValue(new Error('Invalid state'));

      await expect(handler.handle(command)).rejects.toThrow('Invalid state');
    });
  });
});
