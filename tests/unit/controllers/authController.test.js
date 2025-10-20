const AuthController = require('../../../src/adapters/controllers/authController');
const AuthenticateUserCommand = require('../../../src/core/services/features/auth/command/authenticateUser/authenticateUserCommand');
const LogoutUserCommand = require('../../../src/core/services/features/auth/command/logoutUser/logoutUserCommand');
const VerifyTokenCommand = require('../../../src/core/services/features/auth/command/verifyToken/verifyTokenCommand');
const RefreshTokenCommand = require('../../../src/core/services/features/auth/command/refreshToken/refreshTokenCommand');

describe('AuthController', () => {
  let controller;
  let mockAuthenticateUserHandler;
  let mockLogoutUserHandler;
  let mockVerifyTokenHandler;
  let mockRefreshTokenHandler;

  beforeEach(() => {
    mockAuthenticateUserHandler = {
      handle: jest.fn()
    };
    mockLogoutUserHandler = {
      handle: jest.fn()
    };
    mockVerifyTokenHandler = {
      handle: jest.fn()
    };
    mockRefreshTokenHandler = {
      handle: jest.fn()
    };

    controller = new AuthController(
      mockAuthenticateUserHandler,
      mockLogoutUserHandler,
      mockVerifyTokenHandler,
      mockRefreshTokenHandler
    );

    jest.clearAllMocks();
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
        userClient: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com'
        },
        token: 'jwt-token'
      };

      mockAuthenticateUserHandler.handle.mockResolvedValue(mockResult);

      await controller.login(req, res);

      expect(mockAuthenticateUserHandler.handle).toHaveBeenCalledWith(expect.any(AuthenticateUserCommand));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login exitoso',
        user: mockResult.userClient,
        token: mockResult.token
      });
    });

    it('should return 400 for missing credentials', async () => {
      const req = {
        body: {
          username: 'testuser'
          // Missing password
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username y password son requeridos'
      });
    });

    it('should return 401 for invalid credentials', async () => {
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
        message: 'Credenciales inválidas o error de autenticación',
        error: 'Invalid credentials'
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const req = {
        headers: {
          authorization: 'Bearer valid-token'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockLogoutUserHandler.handle.mockResolvedValue();

      await controller.logout(req, res);

      expect(mockLogoutUserHandler.handle).toHaveBeenCalledWith(expect.any(LogoutUserCommand));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logout exitoso'
      });
    });

    it('should return 400 for missing token', async () => {
      const req = {
        headers: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await controller.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token no proporcionado o mal formado'
      });
    });

    it('should return 400 for malformed token', async () => {
      const req = {
        headers: {
          authorization: 'InvalidToken'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await controller.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token no proporcionado o mal formado'
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

      mockVerifyTokenHandler.handle.mockResolvedValue(true);

      await controller.verifyToken(req, res);

      expect(mockVerifyTokenHandler.handle).toHaveBeenCalledWith(expect.any(VerifyTokenCommand));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        valid: true
      });
    });

    it('should return 400 for missing token', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await controller.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token requerido'
      });
    });

    it('should return 401 for invalid token', async () => {
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

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al verificar el token',
        error: 'Invalid token'
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

      const newToken = 'new-access-token';

      mockRefreshTokenHandler.handle.mockResolvedValue(newToken);

      await controller.refreshToken(req, res);

      expect(mockRefreshTokenHandler.handle).toHaveBeenCalledWith(expect.any(RefreshTokenCommand));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token refrescado exitosamente',
        token: newToken
      });
    });

    it('should return 400 for missing refresh token', async () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await controller.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Refresh token requerido'
      });
    });

    it('should return 401 for invalid refresh token', async () => {
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

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al refrescar el token',
        error: 'Invalid refresh token'
      });
    });
  });
});