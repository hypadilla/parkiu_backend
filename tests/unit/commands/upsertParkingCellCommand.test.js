const UpsertParkingCellCommand = require('../../../src/core/services/features/parkingCell/command/upsertParkingCell/upsertParkingCellCommand');

describe('UpsertParkingCellCommand', () => {
  describe('Constructor', () => {
    it('should create command with all properties', () => {
      const commandData = {
        id: 'cell1',
        idStatic: 1,
        state: 'disponible',
        reservationDetails: null
      };

      const command = new UpsertParkingCellCommand(commandData);

      expect(command.id).toBe('cell1');
      expect(command.idStatic).toBe(1);
      expect(command.state).toBe('disponible');
      expect(command.reservationDetails).toBeNull();
    });

    it('should create command with reservation details', () => {
      const commandData = {
        id: 'cell2',
        idStatic: 2,
        state: 'reservado',
        reservationDetails: {
          reservedBy: 'user123',
          startTime: '2023-01-01T10:00:00Z',
          endTime: '2023-01-01T11:00:00Z',
          reason: 'Meeting'
        }
      };

      const command = new UpsertParkingCellCommand(commandData);

      expect(command.id).toBe('cell2');
      expect(command.idStatic).toBe(2);
      expect(command.state).toBe('reservado');
      expect(command.reservationDetails).toEqual(commandData.reservationDetails);
    });

    it('should handle empty command data', () => {
      const commandData = {};

      const command = new UpsertParkingCellCommand(commandData);

      expect(command.id).toBeUndefined();
      expect(command.idStatic).toBeUndefined();
      expect(command.state).toBeUndefined();
      expect(command.reservationDetails).toBeUndefined();
    });

    it('should handle null command data', () => {
      const commandData = null;

      const command = new UpsertParkingCellCommand(commandData);

      expect(command.id).toBeUndefined();
      expect(command.idStatic).toBeUndefined();
      expect(command.state).toBeUndefined();
      expect(command.reservationDetails).toBeUndefined();
    });
  });
});
