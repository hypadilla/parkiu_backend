const UpsertParkingCellHandler = require('../../../src/core/services/features/parkingCell/command/upsertParkingCell/upsertParkingCellHandler');
const ReservationDetails = require('../../../src/core/domain/reservationDetails');

describe('UpsertParkingCellHandler', () => {
  let handler;
  let mockParkingCellRepository;

  beforeEach(() => {
    mockParkingCellRepository = {
      upsertByStaticId: jest.fn()
    };
    handler = new UpsertParkingCellHandler(mockParkingCellRepository);
  });

  describe('handle', () => {
    it('should upsert parking cell successfully', async () => {
      const command = {
        idStatic: 1,
        state: 'disponible'
      };

      mockParkingCellRepository.upsertByStaticId.mockResolvedValue('507f1f77bcf86cd799439011');

      const result = await handler.handle(command);

      expect(mockParkingCellRepository.upsertByStaticId).toHaveBeenCalledWith(1, 'disponible', undefined);
      expect(result).toBe('507f1f77bcf86cd799439011');
    });

    it('should upsert parking cell with reservation details', async () => {
      const command = {
        idStatic: 2,
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user123',
          startTime: new Date('2024-01-01T10:00:00Z'),
          endTime: new Date('2024-01-01T12:00:00Z'),
          reason: 'Meeting'
        }
      };

      mockParkingCellRepository.upsertByStaticId.mockResolvedValue('507f1f77bcf86cd799439012');

      const result = await handler.handle(command);

      expect(mockParkingCellRepository.upsertByStaticId).toHaveBeenCalledWith(
        2,
        'reservado',
        expect.objectContaining({
          reservedBy: 'user123',
          startTime: expect.any(Date),
          endTime: expect.any(Date),
          reason: 'Meeting'
        })
      );
      expect(result).toBe('507f1f77bcf86cd799439012');
    });

    it('should handle repository errors', async () => {
      const command = {
        idStatic: 1,
        state: 'disponible'
      };

      mockParkingCellRepository.upsertByStaticId.mockRejectedValue(new Error('Upsert error'));

      await expect(handler.handle(command)).rejects.toThrow('Upsert error');
    });

    it('should throw error for invalid state', async () => {
      const command = {
        idStatic: 1,
        state: 'invalid_state'
      };

      await expect(handler.handle(command)).rejects.toThrow('El estado \'invalid_state\' no es válido. Debe ser uno de: disponible, ocupado, reservado, inhabilitado');
    });

    it('should throw error when reservation details missing for reserved state', async () => {
      const command = {
        idStatic: 1,
        state: 'reservado'
        // Missing reservationDetails
      };

      await expect(handler.handle(command)).rejects.toThrow('reservationDetails es requerido cuando el estado es "reservado".');
    });

    it('should throw error when required reservation fields missing', async () => {
      const command = {
        idStatic: 1,
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user123'
          // Missing startTime and endTime
        }
      };

      await expect(handler.handle(command)).rejects.toThrow('Los campos reservedBy, startTime y endTime son obligatorios en reservationDetails.');
    });

    it('should handle reservation details with valid reason', async () => {
      const command = {
        idStatic: 3,
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user456',
          startTime: new Date('2024-01-01T14:00:00Z'),
          endTime: new Date('2024-01-01T16:00:00Z'),
          reason: 'Meeting'
        }
      };

      mockParkingCellRepository.upsertByStaticId.mockResolvedValue('507f1f77bcf86cd799439013');

      const result = await handler.handle(command);

      expect(mockParkingCellRepository.upsertByStaticId).toHaveBeenCalledWith(
        3,
        'reservado',
        expect.objectContaining({
          reservedBy: 'user456',
          startTime: expect.any(Date),
          endTime: expect.any(Date),
          reason: 'Meeting'
        })
      );
      expect(result).toBe('507f1f77bcf86cd799439013');
    });
  });
});