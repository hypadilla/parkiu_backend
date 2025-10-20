const UpsertParkingCellCommand = require('../../../src/core/services/features/parkingCell/command/upsertParkingCell/upsertParkingCellCommand');

describe('UpsertParkingCellCommand', () => {
  describe('Constructor', () => {
    it('should create command with all properties', () => {
      const commandData = {
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null
      };

      const command = new UpsertParkingCellCommand(commandData);

      expect(command.idStatic).toBe(1);
      expect(command.state).toBe('disponible');
      expect(command.reservationDetails).toBeNull();
    });

    it('should create command with reservation details', () => {
      const reservationDetails = {
        reservedBy: 'user123',
        startTime: new Date('2024-01-01T10:00:00Z'),
        endTime: new Date('2024-01-01T12:00:00Z'),
        reason: 'Meeting'
      };

      const commandData = {
        idStatic: 2,
        state: 'reservado',
        reservationDetails
      };

      const command = new UpsertParkingCellCommand(commandData);

      expect(command.idStatic).toBe(2);
      expect(command.state).toBe('reservado');
      expect(command.reservationDetails).toEqual(reservationDetails);
    });

    it('should handle empty command data', () => {
      const command = new UpsertParkingCellCommand({});

      expect(command.idStatic).toBeUndefined();
      expect(command.state).toBeUndefined();
      expect(command.reservationDetails).toBeNull();
    });

    it('should handle null command data', () => {
      expect(() => {
        new UpsertParkingCellCommand(null);
      }).toThrow();
    });

    it('should handle undefined command data', () => {
      expect(() => {
        new UpsertParkingCellCommand(undefined);
      }).toThrow();
    });

    it('should set default reservationDetails to null', () => {
      const commandData = {
        idStatic: 3,
        state: 'ocupado'
        // reservationDetails not provided
      };

      const command = new UpsertParkingCellCommand(commandData);

      expect(command.idStatic).toBe(3);
      expect(command.state).toBe('ocupado');
      expect(command.reservationDetails).toBeNull();
    });
  });
});