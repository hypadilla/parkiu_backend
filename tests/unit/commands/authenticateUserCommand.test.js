const AuthenticateUserCommand = require('../../../src/core/services/features/auth/command/authenticateUser/authenticateUserCommand');

describe('AuthenticateUserCommand', () => {
  describe('Constructor', () => {
    it('should create command with username and password', () => {
      const command = new AuthenticateUserCommand('testuser', 'password123');

      expect(command.username).toBe('testuser');
      expect(command.password).toBe('password123');
    });

    it('should handle empty username', () => {
      const command = new AuthenticateUserCommand('', 'password123');

      expect(command.username).toBe('');
      expect(command.password).toBe('password123');
    });

    it('should handle empty password', () => {
      const command = new AuthenticateUserCommand('testuser', '');

      expect(command.username).toBe('testuser');
      expect(command.password).toBe('');
    });

    it('should handle null username', () => {
      const command = new AuthenticateUserCommand(null, 'password123');

      expect(command.username).toBeNull();
      expect(command.password).toBe('password123');
    });

    it('should handle null password', () => {
      const command = new AuthenticateUserCommand('testuser', null);

      expect(command.username).toBe('testuser');
      expect(command.password).toBeNull();
    });

    it('should handle undefined username', () => {
      const command = new AuthenticateUserCommand(undefined, 'password123');

      expect(command.username).toBeUndefined();
      expect(command.password).toBe('password123');
    });

    it('should handle undefined password', () => {
      const command = new AuthenticateUserCommand('testuser', undefined);

      expect(command.username).toBe('testuser');
      expect(command.password).toBeUndefined();
    });

    it('should handle special characters in username', () => {
      const command = new AuthenticateUserCommand('user@domain.com', 'password123');

      expect(command.username).toBe('user@domain.com');
      expect(command.password).toBe('password123');
    });

    it('should handle special characters in password', () => {
      const command = new AuthenticateUserCommand('testuser', 'password!@#$%^&*()');

      expect(command.username).toBe('testuser');
      expect(command.password).toBe('password!@#$%^&*()');
    });

    it('should handle long username', () => {
      const longUsername = 'a'.repeat(100);
      const command = new AuthenticateUserCommand(longUsername, 'password123');

      expect(command.username).toBe(longUsername);
      expect(command.password).toBe('password123');
    });

    it('should handle long password', () => {
      const longPassword = 'a'.repeat(100);
      const command = new AuthenticateUserCommand('testuser', longPassword);

      expect(command.username).toBe('testuser');
      expect(command.password).toBe(longPassword);
    });

    it('should handle numeric username', () => {
      const command = new AuthenticateUserCommand('123456', 'password123');

      expect(command.username).toBe('123456');
      expect(command.password).toBe('password123');
    });

    it('should handle numeric password', () => {
      const command = new AuthenticateUserCommand('testuser', '123456');

      expect(command.username).toBe('testuser');
      expect(command.password).toBe('123456');
    });
  });
});