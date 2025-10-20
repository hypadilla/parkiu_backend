const RefreshTokenHandler = require('../../../src/core/services/features/auth/command/refreshToken/refreshTokenHandler');
const jwt = require('jsonwebtoken');

// Mock jwt
jest.mock('jsonwebtoken');

describe('RefreshTokenHandler', () => {
  let handler;

  beforeEach(() => {
    handler = new RefreshTokenHandler();
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should refresh token successfully', async () => {
      const command = {
        refreshToken: 'valid-refresh-token'
      };

      const decodedToken = {
        userId: '1',
        username: 'testuser'
      };

      const newToken = 'new-access-token';

      jwt.verify.mockReturnValue(decodedToken);
      jwt.sign.mockReturnValue(newToken);

      const result = await handler.handle(command);

      expect(jwt.verify).toHaveBeenCalledWith('valid-refresh-token', expect.any(String));
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: '1', username: 'testuser' },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(result).toBe(newToken);
    });

    it('should throw error for invalid refresh token', async () => {
      const command = {
        refreshToken: 'invalid-refresh-token'
      };

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(handler.handle(command)).rejects.toThrow('Refresh token inválido o expirado');
    });

    it('should throw error for expired refresh token', async () => {
      const command = {
        refreshToken: 'expired-refresh-token'
      };

      jwt.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(handler.handle(command)).rejects.toThrow('Refresh token inválido o expirado');
    });

    it('should throw error for missing refresh token', async () => {
      const command = {
        refreshToken: null
      };

      jwt.verify.mockImplementation(() => {
        throw new Error('No token provided');
      });

      await expect(handler.handle(command)).rejects.toThrow('Refresh token inválido o expirado');
    });

    it('should handle jwt.sign errors', async () => {
      const command = {
        refreshToken: 'valid-refresh-token'
      };

      const decodedToken = {
        userId: '1',
        username: 'testuser'
      };

      jwt.verify.mockReturnValue(decodedToken);
      jwt.sign.mockImplementation(() => {
        throw new Error('Sign error');
      });

      await expect(handler.handle(command)).rejects.toThrow('Refresh token inválido o expirado');
    });
  });
});