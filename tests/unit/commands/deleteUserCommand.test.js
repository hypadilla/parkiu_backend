const DeleteUserCommand = require('../../../src/core/services/features/user/command/deleteUserCommand/deleteUserCommand');

describe('DeleteUserCommand', () => {
  describe('Constructor', () => {
    it('should create command with id', () => {
      const commandData = {
        id: '1'
      };

      const command = new DeleteUserCommand(commandData);

      expect(command.id).toBe('1');
    });

    it('should handle empty command data', () => {
      const commandData = {};

      const command = new DeleteUserCommand(commandData);

      expect(command.id).toBeUndefined();
    });

    it('should handle null command data', () => {
      const commandData = null;

      const command = new DeleteUserCommand(commandData);

      expect(command.id).toBeUndefined();
    });
  });
});
