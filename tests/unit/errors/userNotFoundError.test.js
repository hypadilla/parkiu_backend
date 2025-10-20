const UserNotFoundError = require('../../../src/core/errors/userNotFoundError');

describe('UserNotFoundError', () => {
  describe('Constructor', () => {
    it('should create error with default message', () => {
      const error = new UserNotFoundError();

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('UserNotFoundError');
      expect(error.message).toBe('Usuario no encontrado');
    });

    it('should create error with custom message', () => {
      const customMessage = 'User with ID 123 not found';
      const error = new UserNotFoundError(customMessage);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('UserNotFoundError');
      expect(error.message).toBe(customMessage);
    });

    it('should create error with empty message', () => {
      const error = new UserNotFoundError('');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('UserNotFoundError');
      expect(error.message).toBe('');
    });
  });

  describe('Error Properties', () => {
    it('should have correct error properties', () => {
      const error = new UserNotFoundError('Custom message');

      expect(error.name).toBe('UserNotFoundError');
      expect(error.message).toBe('Custom message');
      expect(error.stack).toBeDefined();
    });
  });
});
