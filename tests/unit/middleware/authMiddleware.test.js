const authMiddleware = require('../../../src/adapters/middlewares/authMiddleware');

// Mock JWT service
const mockJwtAuthService = {
  verifyToken: jest.fn()
};

// Mock token blacklist
const mockTokenBlacklist = new Set();

// Mock user repository
const mockUserRepository = {
  getById: jest.fn()
};

// Mock the dependencies
jest.mock('../../../src/infrastructure/services/jwtAuthService', () => mockJwtAuthService);
jest.mock('../../../src/infrastructure/repositories/userRepository', () => mockUserRepository);

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('Valid Token', () => {
    it('should authenticate user with valid token', async () => {
      const token = 'valid-token';
      const decoded = { userId: '1', username: 'testuser' };
      const user = { id: '1', username: 'testuser', email: 'test@example.com' };

      req.headers.authorization = `Bearer ${token}`;
      mockJwtAuthService.verifyToken.mockReturnValue(decoded);
      mockUserRepository.getById.mockResolvedValue(user);

      await authMiddleware(req, res, next);

      expect(mockJwtAuthService.verifyToken).toHaveBeenCalledWith(token);
      expect(mockUserRepository.getById).toHaveBeenCalledWith('1');
      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle token without Bearer prefix', async () => {
      const token = 'valid-token';
      const decoded = { userId: '1', username: 'testuser' };
      const user = { id: '1', username: 'testuser' };

      req.headers.authorization = token;
      mockJwtAuthService.verifyToken.mockReturnValue(decoded);
      mockUserRepository.getById.mockResolvedValue(user);

      await authMiddleware(req, res, next);

      expect(mockJwtAuthService.verifyToken).toHaveBeenCalledWith(token);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Invalid Token', () => {
    it('should return 401 for missing authorization header', async () => {
      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Token de autorización requerido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token format', async () => {
      req.headers.authorization = 'InvalidFormat token';

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Formato de token inválido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      mockJwtAuthService.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Token inválido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user not found', async () => {
      const token = 'valid-token';
      const decoded = { userId: '1', username: 'testuser' };

      req.headers.authorization = `Bearer ${token}`;
      mockJwtAuthService.verifyToken.mockReturnValue(decoded);
      mockUserRepository.getById.mockResolvedValue(null);

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Usuario no encontrado'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle token verification errors', async () => {
      req.headers.authorization = 'Bearer some-token';
      mockJwtAuthService.verifyToken.mockImplementation(() => {
        throw new Error('Token verification error');
      });

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Token inválido'
      });
    });

    it('should handle user repository errors', async () => {
      const token = 'valid-token';
      const decoded = { userId: '1', username: 'testuser' };

      req.headers.authorization = `Bearer ${token}`;
      mockJwtAuthService.verifyToken.mockReturnValue(decoded);
      mockUserRepository.getById.mockRejectedValue(new Error('Database error'));

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error interno del servidor'
      });
    });
  });
});
