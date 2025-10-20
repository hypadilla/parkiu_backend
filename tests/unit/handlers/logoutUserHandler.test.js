const LogoutUserHandler = require('../../../src/core/services/features/auth/command/logoutUser/logoutUserHandler');

describe('LogoutUserHandler', () => {
  let handler;
  let mockTokenBlacklist;

  beforeEach(() => {
    mockTokenBlacklist = {
      add: jest.fn()
    };
    handler = new LogoutUserHandler(mockTokenBlacklist);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should logout user successfully', async () => {
      const command = {
        token: 'valid-token'
      };

      const result = await handler.handle(command);

      expect(mockTokenBlacklist.add).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual({
        message: 'Logged out successfully'
      });
    });

    it('should handle empty token', async () => {
      const command = {
        token: ''
      };

      const result = await handler.handle(command);

      expect(mockTokenBlacklist.add).toHaveBeenCalledWith('');
      expect(result).toEqual({
        message: 'Logged out successfully'
      });
    });

    it('should handle null token', async () => {
      const command = {
        token: null
      };

      const result = await handler.handle(command);

      expect(mockTokenBlacklist.add).toHaveBeenCalledWith(null);
      expect(result).toEqual({
        message: 'Logged out successfully'
      });
    });

    it('should handle undefined token', async () => {
      const command = {
        token: undefined
      };

      const result = await handler.handle(command);

      expect(mockTokenBlacklist.add).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({
        message: 'Logged out successfully'
      });
    });

    it('should handle long token', async () => {
      const longToken = 'a'.repeat(1000);
      const command = {
        token: longToken
      };

      const result = await handler.handle(command);

      expect(mockTokenBlacklist.add).toHaveBeenCalledWith(longToken);
      expect(result).toEqual({
        message: 'Logged out successfully'
      });
    });

    it('should handle special characters in token', async () => {
      const specialToken = 'token-with-special-chars!@#$%^&*()';
      const command = {
        token: specialToken
      };

      const result = await handler.handle(command);

      expect(mockTokenBlacklist.add).toHaveBeenCalledWith(specialToken);
      expect(result).toEqual({
        message: 'Logged out successfully'
      });
    });

    it('should handle multiple tokens in blacklist', async () => {
      const command1 = { token: 'token1' };
      const command2 = { token: 'token2' };

      await handler.handle(command1);
      await handler.handle(command2);

      expect(mockTokenBlacklist.add).toHaveBeenCalledWith('token1');
      expect(mockTokenBlacklist.add).toHaveBeenCalledWith('token2');
      expect(mockTokenBlacklist.add).toHaveBeenCalledTimes(2);
    });
  });
});