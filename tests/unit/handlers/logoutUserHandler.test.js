const LogoutUserHandler = require('../../../src/core/services/features/auth/command/logoutUser/logoutUserHandler');

describe('LogoutUserHandler', () => {
  let mockTokenBlacklist;
  let handler;

  beforeEach(() => {
    mockTokenBlacklist = new Set();
    handler = new LogoutUserHandler(mockTokenBlacklist);
  });

  describe('handle', () => {
    it('should add token to blacklist successfully', async () => {
      const command = { token: 'some-token' };

      const result = await handler.handle(command);

      expect(mockTokenBlacklist.has('some-token')).toBe(true);
      expect(result).toEqual({ success: true });
    });

    it('should handle multiple tokens in blacklist', async () => {
      const command1 = { token: 'token1' };
      const command2 = { token: 'token2' };

      await handler.handle(command1);
      await handler.handle(command2);

      expect(mockTokenBlacklist.has('token1')).toBe(true);
      expect(mockTokenBlacklist.has('token2')).toBe(true);
      expect(mockTokenBlacklist.size).toBe(2);
    });

    it('should handle empty token', async () => {
      const command = { token: '' };

      const result = await handler.handle(command);

      expect(mockTokenBlacklist.has('')).toBe(true);
      expect(result).toEqual({ success: true });
    });

    it('should handle null token', async () => {
      const command = { token: null };

      const result = await handler.handle(command);

      expect(mockTokenBlacklist.has(null)).toBe(true);
      expect(result).toEqual({ success: true });
    });
  });
});
