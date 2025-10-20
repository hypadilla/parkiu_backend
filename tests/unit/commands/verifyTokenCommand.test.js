const VerifyTokenCommand = require('../../../src/core/services/features/auth/command/verifyToken/verifyTokenCommand');

describe('VerifyTokenCommand', () => {
  describe('Constructor', () => {
    it('should create command with token', () => {
      const command = new VerifyTokenCommand('valid-token');

      expect(command.token).toBe('valid-token');
    });

    it('should handle empty token', () => {
      const command = new VerifyTokenCommand('');

      expect(command.token).toBe('');
    });

    it('should handle null token', () => {
      const command = new VerifyTokenCommand(null);

      expect(command.token).toBeNull();
    });

    it('should handle undefined token', () => {
      const command = new VerifyTokenCommand(undefined);

      expect(command.token).toBeUndefined();
    });

    it('should handle JWT format token', () => {
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const command = new VerifyTokenCommand(jwtToken);

      expect(command.token).toBe(jwtToken);
    });

    it('should handle long token', () => {
      const longToken = 'a'.repeat(1000);
      const command = new VerifyTokenCommand(longToken);

      expect(command.token).toBe(longToken);
    });

    it('should handle special characters in token', () => {
      const specialToken = 'token-with-special-chars!@#$%^&*()';
      const command = new VerifyTokenCommand(specialToken);

      expect(command.token).toBe(specialToken);
    });
  });
});