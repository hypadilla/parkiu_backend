const AuthController = require('../../../src/adapters/controllers/authController');

describe('AuthController', () => {
  let mockAuthenticateUserHandler;
  let mockVerifyTokenHandler;
  let mockLogoutUserHandler;
  let mockRefreshTokenHandler;
  let controller;

  beforeEach(() => {
    mockAuthenticateUserHandler = {
      handle: jest.fn()
    };
    mockVerifyTokenHandler = {
      handle: jest.fn()
    };
    mockLogoutUserHandler = {
      handle: jest.fn()
    };
    mockRefreshTokenHandler = {
      handle: jest.fn()
    };
    controller = new AuthController(
      mockAuthenticateUserHandler,
      mockVerifyTokenHandler,
      mockLogoutUserHandler,
      mockRefreshTokenHandler
    );
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        user: { id: '1', username: 'testuser' },
        token: 'jwt-token'
      };

      mockAuthenticateUserHandler.handle.mockResolvedValue(mockResult);

      await controller.login(req, res);

      expect(mockAuthenticateUserHandler.handle).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockResult.user,
        token: mockResult.token
      });
    });

    it('should handle authentication errors', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'wrongpassword'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAuthenticateUserHandler.handle.mockRejectedValue(new Error('Invalid credentials'));

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials'
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const req = {
        body: {
          token: 'valid-token'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        valid: true,
        user: { id: '1', username: 'testuser' }
      };

      mockVerifyTokenHandler.handle.mockResolvedValue(mockResult);

      await controller.verifyToken(req, res);

      expect(mockVerifyTokenHandler.handle).toHaveBeenCalledWith({
        token: 'valid-token'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        valid: true,
        user: mockResult.user
      });
    });

    it('should handle invalid token', async () => {
      const req = {
        body: {
          token: 'invalid-token'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockVerifyTokenHandler.handle.mockRejectedValue(new Error('Invalid token'));

      await controller.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid token'
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const req = {
        body: {
          token: 'some-token'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockLogoutUserHandler.handle.mockResolvedValue({ success: true });

      await controller.logout(req, res);

      expect(mockLogoutUserHandler.handle).toHaveBeenCalledWith({
        token: 'some-token'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const req = {
        body: {
          refreshToken: 'valid-refresh-token'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        token: 'new-jwt-token'
      };

      mockRefreshTokenHandler.handle.mockResolvedValue(mockResult);

      await controller.refreshToken(req, res);

      expect(mockRefreshTokenHandler.handle).toHaveBeenCalledWith({
        refreshToken: 'valid-refresh-token'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'new-jwt-token'
      });
    });

    it('should handle refresh token errors', async () => {
      const req = {
        body: {
          refreshToken: 'invalid-refresh-token'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockRefreshTokenHandler.handle.mockRejectedValue(new Error('Invalid refresh token'));

      await controller.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid refresh token'
      });
    });
  });
});
