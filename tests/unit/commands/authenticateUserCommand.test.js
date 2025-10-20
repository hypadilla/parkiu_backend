const AuthenticateUserCommand = require('../../../src/core/services/features/auth/command/authenticateUser/authenticateUserCommand');

describe('AuthenticateUserCommand', () => {
  describe('Constructor', () => {
    it('should create command with username and password', () => {
      const commandData = {
        username: 'testuser',
        password: 'password123'
      };

      const command = new AuthenticateUserCommand(commandData);

      expect(command.username).toBe('testuser');
      expect(command.password).toBe('password123');
    });

    it('should handle empty command data', () => {
      const commandData = {};

      const command = new AuthenticateUserCommand(commandData);

      expect(command.username).toBeUndefined();
      expect(command.password).toBeUndefined();
    });
  });
});
