const LogoutUserCommand = require('../../../src/core/services/features/auth/command/logoutUser/logoutUserCommand');

describe('LogoutUserCommand', () => {
  describe('Constructor', () => {
    it('should create command with token', () => {
      const command = new LogoutUserCommand('valid-token');

      expect(command.token).toBe('valid-token');
    });

    it('should handle empty token', () => {
      const command = new LogoutUserCommand('');

      expect(command.token).toBe('');
    });

    it('should handle null token', () => {
      const command = new LogoutUserCommand(null);

      expect(command.token).toBeNull();
    });

    it('should handle undefined token', () => {
      const command = new LogoutUserCommand(undefined);

      expect(command.token).toBeUndefined();
    });

    it('should handle long token', () => {
      const longToken = 'a'.repeat(1000);
      const command = new LogoutUserCommand(longToken);

      expect(command.token).toBe(longToken);
    });

    it('should handle special characters in token', () => {
      const specialToken = 'token-with-special-chars!@#$%^&*()';
      const command = new LogoutUserCommand(specialToken);

      expect(command.token).toBe(specialToken);
    });

    it('should handle JWT format token', () => {
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const command = new LogoutUserCommand(jwtToken);

      expect(command.token).toBe(jwtToken);
    });
  });
});