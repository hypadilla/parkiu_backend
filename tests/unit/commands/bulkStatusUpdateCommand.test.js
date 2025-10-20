const BulkStatusUpdateCommand = require('../../../src/core/services/features/parkingCell/command/bulkStatusUpdate/bulkStatusUpdateCommand');

describe('BulkStatusUpdateCommand', () => {
  describe('Constructor', () => {
    it('should create command with updates array', () => {
      const commandData = {
        updates: [
          { id: 'cell1', state: 'ocupado' },
          { id: 'cell2', state: 'disponible' }
        ]
      };

      const command = new BulkStatusUpdateCommand(commandData);

      expect(command.updates).toEqual(commandData.updates);
      expect(command.updates).toHaveLength(2);
    });

    it('should create command with empty updates array', () => {
      const commandData = {
        updates: []
      };

      const command = new BulkStatusUpdateCommand(commandData);

      expect(command.updates).toEqual([]);
      expect(command.updates).toHaveLength(0);
    });

    it('should handle empty command data', () => {
      const commandData = {};

      const command = new BulkStatusUpdateCommand(commandData);

      expect(command.updates).toBeUndefined();
    });

    it('should handle null command data', () => {
      const commandData = null;

      const command = new BulkStatusUpdateCommand(commandData);

      expect(command.updates).toBeUndefined();
    });

    it('should handle large updates array', () => {
      const updates = Array(100).fill().map((_, i) => ({
        id: `cell${i}`,
        state: i % 2 === 0 ? 'disponible' : 'ocupado'
      }));

      const commandData = { updates };

      const command = new BulkStatusUpdateCommand(commandData);

      expect(command.updates).toEqual(updates);
      expect(command.updates).toHaveLength(100);
    });
  });
});
