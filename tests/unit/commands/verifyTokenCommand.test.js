const VerifyTokenCommand = require('../../../src/core/services/features/auth/command/verifyToken/verifyTokenCommand');

describe('VerifyTokenCommand', () => {
  describe('Constructor', () => {
    it('should create command with token', () => {
      const commandData = {
        token: 'jwt-token-123'
      };

      const command = new VerifyTokenCommand(commandData);

      expect(command.token).toBe('jwt-token-123');
    });

    it('should handle empty command data', () => {
      const commandData = {};

      const command = new VerifyTokenCommand(commandData);

      expect(command.token).toBeUndefined();
    });

    it('should handle null command data', () => {
      const commandData = null;

      const command = new VerifyTokenCommand(commandData);

      expect(command.token).toBeUndefined();
    });
  });
});
