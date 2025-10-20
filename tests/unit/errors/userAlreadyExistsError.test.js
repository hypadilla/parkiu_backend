const UserAlreadyExistsError = require('../../../src/core/errors/userAlreadyExistsError');

describe('UserAlreadyExistsError', () => {
  describe('Constructor', () => {
    it('should create error with username field', () => {
      const error = new UserAlreadyExistsError('username');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('UserAlreadyExistsError');
      expect(error.message).toBe('A user with this username already exists');
      expect(error.field).toBe('username');
    });

    it('should create error with email field', () => {
      const error = new UserAlreadyExistsError('email');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('UserAlreadyExistsError');
      expect(error.message).toBe('A user with this email already exists');
      expect(error.field).toBe('email');
    });

    it('should create error with custom field', () => {
      const error = new UserAlreadyExistsError('phone');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('UserAlreadyExistsError');
      expect(error.message).toBe('A user with this phone already exists');
      expect(error.field).toBe('phone');
    });
  });

  describe('Error Properties', () => {
    it('should have correct error properties', () => {
      const error = new UserAlreadyExistsError('username');

      expect(error.name).toBe('UserAlreadyExistsError');
      expect(error.message).toBe('A user with this username already exists');
      expect(error.field).toBe('username');
      expect(error.stack).toBeDefined();
    });
  });
});
