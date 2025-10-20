const VerifyTokenHandler = require('../../../src/core/services/features/auth/command/verifyToken/verifyTokenHandler');

describe('VerifyTokenHandler', () => {
  let mockAuthService;
  let mockTokenBlacklist;
  let handler;

  beforeEach(() => {
    mockAuthService = {
      verifyToken: jest.fn()
    };
    mockTokenBlacklist = new Set();
    handler = new VerifyTokenHandler(mockAuthService, mockTokenBlacklist);
  });

  describe('handle', () => {
    it('should verify valid token successfully', async () => {
      const command = { token: 'valid-token' };
      const decoded = { userId: '1', username: 'testuser' };

      mockAuthService.verifyToken.mockReturnValue(decoded);

      const result = await handler.handle(command);

      expect(mockAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual(decoded);
    });

    it('should throw error for blacklisted token', async () => {
      const command = { token: 'blacklisted-token' };

      mockTokenBlacklist.add('blacklisted-token');

      await expect(handler.handle(command)).rejects.toThrow('Token ha sido invalidado');
      expect(mockAuthService.verifyToken).not.toHaveBeenCalled();
    });

    it('should throw error for invalid token', async () => {
      const command = { token: 'invalid-token' };

      mockAuthService.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(handler.handle(command)).rejects.toThrow('Invalid token');
    });

    it('should handle auth service errors', async () => {
      const command = { token: 'some-token' };

      mockAuthService.verifyToken.mockImplementation(() => {
        throw new Error('Auth service error');
      });

      await expect(handler.handle(command)).rejects.toThrow('Auth service error');
    });
  });
});
