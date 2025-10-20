const RefreshTokenHandler = require('../../../src/core/services/features/auth/command/refreshToken/refreshTokenHandler');

describe('RefreshTokenHandler', () => {
  let mockAuthService;
  let handler;

  beforeEach(() => {
    mockAuthService = {
      verifyToken: jest.fn(),
      generateToken: jest.fn()
    };
    handler = new RefreshTokenHandler(mockAuthService);
  });

  describe('handle', () => {
    it('should refresh token successfully', async () => {
      const command = { refreshToken: 'valid-refresh-token' };
      const decoded = { userId: '1', username: 'testuser' };
      const newToken = 'new-jwt-token';

      mockAuthService.verifyToken.mockReturnValue(decoded);
      mockAuthService.generateToken.mockReturnValue(newToken);

      const result = await handler.handle(command);

      expect(mockAuthService.verifyToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(mockAuthService.generateToken).toHaveBeenCalledWith(decoded);
      expect(result).toEqual({ token: newToken });
    });

    it('should throw error for invalid refresh token', async () => {
      const command = { refreshToken: 'invalid-refresh-token' };

      mockAuthService.verifyToken.mockImplementation(() => {
        throw new Error('Invalid refresh token');
      });

      await expect(handler.handle(command)).rejects.toThrow('Invalid refresh token');
      expect(mockAuthService.generateToken).not.toHaveBeenCalled();
    });

    it('should handle token generation errors', async () => {
      const command = { refreshToken: 'valid-refresh-token' };
      const decoded = { userId: '1', username: 'testuser' };

      mockAuthService.verifyToken.mockReturnValue(decoded);
      mockAuthService.generateToken.mockImplementation(() => {
        throw new Error('Token generation error');
      });

      await expect(handler.handle(command)).rejects.toThrow('Token generation error');
    });

    it('should handle verify token errors', async () => {
      const command = { refreshToken: 'some-token' };

      mockAuthService.verifyToken.mockImplementation(() => {
        throw new Error('Verify token error');
      });

      await expect(handler.handle(command)).rejects.toThrow('Verify token error');
    });
  });
});
