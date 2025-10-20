const RefreshTokenCommand = require('../../../src/core/services/features/auth/command/refreshToken/refreshTokenCommand');

describe('RefreshTokenCommand', () => {
  describe('Constructor', () => {
    it('should create command with refresh token', () => {
      const commandData = {
        refreshToken: 'refresh-token-123'
      };

      const command = new RefreshTokenCommand(commandData);

      expect(command.refreshToken).toBe('refresh-token-123');
    });

    it('should handle empty command data', () => {
      const commandData = {};

      const command = new RefreshTokenCommand(commandData);

      expect(command.refreshToken).toBeUndefined();
    });

    it('should handle null command data', () => {
      const commandData = null;

      const command = new RefreshTokenCommand(commandData);

      expect(command.refreshToken).toBeUndefined();
    });
  });
});
