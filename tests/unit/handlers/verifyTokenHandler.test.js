const VerifyTokenHandler = require('../../../src/core/services/features/auth/command/verifyToken/verifyTokenHandler');

describe('VerifyTokenHandler', () => {
  let handler;
  let mockAuthService;

  beforeEach(() => {
    mockAuthService = {
      verifyToken: jest.fn()
    };
    handler = new VerifyTokenHandler(mockAuthService);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should verify valid token successfully', async () => {
      const query = {
        token: 'valid-token'
      };

      const mockResult = {
        valid: true,
        user: {
          id: '1',
          username: 'testuser'
        }
      };

      mockAuthService.verifyToken.mockResolvedValue(mockResult);

      const result = await handler.handle(query);

      expect(mockAuthService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual(mockResult);
    });

    it('should throw error for invalid token', async () => {
      const query = {
        token: 'invalid-token'
      };

      mockAuthService.verifyToken.mockRejectedValue(new Error('Invalid token'));

      await expect(handler.handle(query)).rejects.toThrow('Invalid token');
    });

    it('should handle empty token', async () => {
      const query = {
        token: ''
      };

      mockAuthService.verifyToken.mockRejectedValue(new Error('Token is required'));

      await expect(handler.handle(query)).rejects.toThrow('Token is required');
    });

    it('should handle null token', async () => {
      const query = {
        token: null
      };

      mockAuthService.verifyToken.mockRejectedValue(new Error('Token is required'));

      await expect(handler.handle(query)).rejects.toThrow('Token is required');
    });

    it('should handle undefined token', async () => {
      const query = {
        token: undefined
      };

      mockAuthService.verifyToken.mockRejectedValue(new Error('Token is required'));

      await expect(handler.handle(query)).rejects.toThrow('Token is required');
    });

    it('should handle auth service errors', async () => {
      const query = {
        token: 'valid-token'
      };

      mockAuthService.verifyToken.mockRejectedValue(new Error('Auth service error'));

      await expect(handler.handle(query)).rejects.toThrow('Auth service error');
    });

    it('should return verification result with user details', async () => {
      const query = {
        token: 'valid-token'
      };

      const mockResult = {
        valid: true,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'admin'
        },
        expiresAt: new Date(Date.now() + 3600000)
      };

      mockAuthService.verifyToken.mockResolvedValue(mockResult);

      const result = await handler.handle(query);

      expect(result).toEqual(mockResult);
    });

    it('should handle expired token', async () => {
      const query = {
        token: 'expired-token'
      };

      mockAuthService.verifyToken.mockRejectedValue(new Error('Token expired'));

      await expect(handler.handle(query)).rejects.toThrow('Token expired');
    });

    it('should handle malformed token', async () => {
      const query = {
        token: 'malformed.token'
      };

      mockAuthService.verifyToken.mockRejectedValue(new Error('Malformed token'));

      await expect(handler.handle(query)).rejects.toThrow('Malformed token');
    });
  });
});