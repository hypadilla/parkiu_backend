const BulkStatusUpdateCommand = require('../../../src/core/services/features/parkingCell/command/bulkStatusUpdate/bulkStatusUpdateCommand');

describe('BulkStatusUpdateCommand', () => {
  describe('Constructor', () => {
    it('should create command with data', () => {
      const data = {
        sectores: [
          {
            celdas: {
              '1': 'ocupado',
              '2': 'disponible'
            }
          }
        ]
      };

      const command = new BulkStatusUpdateCommand(data);

      expect(command.data).toEqual(data);
    });

    it('should handle empty data', () => {
      const command = new BulkStatusUpdateCommand({});

      expect(command.data).toEqual({});
    });

    it('should handle null data', () => {
      const command = new BulkStatusUpdateCommand(null);

      expect(command.data).toBeNull();
    });

    it('should handle undefined data', () => {
      const command = new BulkStatusUpdateCommand(undefined);

      expect(command.data).toBeUndefined();
    });

    it('should handle complex data structure', () => {
      const complexData = {
        sectores: [
          {
            nombre: 'Sector A',
            celdas: {
              '1': 'ocupado',
              '2': 'disponible',
              '3': 'reservado'
            }
          },
          {
            nombre: 'Sector B',
            celdas: {
              '4': 'inhabilitado',
              '5': 'disponible'
            }
          }
        ],
        metadata: {
          timestamp: new Date(),
          user: 'admin'
        }
      };

      const command = new BulkStatusUpdateCommand(complexData);

      expect(command.data).toEqual(complexData);
    });

    it('should handle empty sectores', () => {
      const data = {
        sectores: []
      };

      const command = new BulkStatusUpdateCommand(data);

      expect(command.data).toEqual(data);
    });

    it('should handle sectores with empty celdas', () => {
      const data = {
        sectores: [
          {
            celdas: {}
          }
        ]
      };

      const command = new BulkStatusUpdateCommand(data);

      expect(command.data).toEqual(data);
    });

    it('should handle string data', () => {
      const stringData = '{"sectores": []}';
      const command = new BulkStatusUpdateCommand(stringData);

      expect(command.data).toBe(stringData);
    });

    it('should handle numeric data', () => {
      const numericData = 123;
      const command = new BulkStatusUpdateCommand(numericData);

      expect(command.data).toBe(123);
    });

    it('should handle boolean data', () => {
      const booleanData = true;
      const command = new BulkStatusUpdateCommand(booleanData);

      expect(command.data).toBe(true);
    });
  });
});