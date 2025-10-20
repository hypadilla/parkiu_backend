const CreateUserCommand = require('../../../src/core/services/features/user/command/createUserCommand/createUserCommand');

describe('CreateUserCommand', () => {
  describe('Constructor', () => {
    it('should create command with all properties', () => {
      const commandData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        lastName: 'User',
        role: 'USER'
      };

      const command = new CreateUserCommand(commandData);

      expect(command.username).toBe('testuser');
      expect(command.email).toBe('test@example.com');
      expect(command.password).toBe('password123');
      expect(command.name).toBe('Test');
      expect(command.lastName).toBe('User');
      expect(command.role).toBe('USER');
    });

    it('should create command with minimal properties', () => {
      const commandData = {
        username: 'minimaluser',
        email: 'minimal@example.com',
        password: 'password123'
      };

      const command = new CreateUserCommand(commandData);

      expect(command.username).toBe('minimaluser');
      expect(command.email).toBe('minimal@example.com');
      expect(command.password).toBe('password123');
      expect(command.name).toBeUndefined();
      expect(command.lastName).toBeUndefined();
      expect(command.role).toBeUndefined();
    });

    it('should handle empty command data', () => {
      const commandData = {};

      const command = new CreateUserCommand(commandData);

      expect(command.username).toBeUndefined();
      expect(command.email).toBeUndefined();
      expect(command.password).toBeUndefined();
    });
  });
});
