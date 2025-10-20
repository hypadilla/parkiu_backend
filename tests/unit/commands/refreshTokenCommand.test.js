const RefreshTokenCommand = require('../../../src/core/services/features/auth/command/refreshToken/refreshTokenCommand');

describe('RefreshTokenCommand', () => {
  describe('Constructor', () => {
    it('should create command with refresh token', () => {
      const command = new RefreshTokenCommand('valid-refresh-token');

      expect(command.refreshToken).toBe('valid-refresh-token');
    });

    it('should handle empty refresh token', () => {
      const command = new RefreshTokenCommand('');

      expect(command.refreshToken).toBe('');
    });

    it('should handle null refresh token', () => {
      const command = new RefreshTokenCommand(null);

      expect(command.refreshToken).toBeNull();
    });

    it('should handle undefined refresh token', () => {
      const command = new RefreshTokenCommand(undefined);

      expect(command.refreshToken).toBeUndefined();
    });

    it('should handle long refresh token', () => {
      const longToken = 'a'.repeat(1000);
      const command = new RefreshTokenCommand(longToken);

      expect(command.refreshToken).toBe(longToken);
    });

    it('should handle special characters in refresh token', () => {
      const specialToken = 'token-with-special-chars!@#$%^&*()';
      const command = new RefreshTokenCommand(specialToken);

      expect(command.refreshToken).toBe(specialToken);
    });
  });
});