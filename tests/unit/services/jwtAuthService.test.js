const JwtAuthService = require('../../../src/infrastructure/services/jwtAuthService');
const bcrypt = require('bcrypt');

// Mock bcrypt
jest.mock('bcrypt');

describe('JwtAuthService', () => {
  let service;

  beforeEach(() => {
    service = new JwtAuthService();
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';

      bcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await service.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle hashing errors', async () => {
      const password = 'password123';

      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

      await expect(service.hashPassword(password)).rejects.toThrow('Hashing error');
    });
  });

  describe('comparePassword', () => {
    it('should compare password successfully', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';

      bcrypt.compare.mockResolvedValue(true);

      const result = await service.comparePassword(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'wrongpassword';
      const hashedPassword = 'hashedpassword123';

      bcrypt.compare.mockResolvedValue(false);

      const result = await service.comparePassword(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });

    it('should handle comparison errors', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';

      bcrypt.compare.mockRejectedValue(new Error('Comparison error'));

      await expect(service.comparePassword(password, hashedPassword)).rejects.toThrow('Comparison error');
    });
  });

  describe('generateToken', () => {
    it('should generate token successfully', () => {
      const payload = { userId: '1', username: 'testuser' };
      const token = 'jwt-token-123';

      // Mock jwt.sign to return a token
      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'sign').mockReturnValue(token);

      const result = service.generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
      expect(result).toBe(token);
    });

    it('should handle token generation errors', () => {
      const payload = { userId: '1', username: 'testuser' };

      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'sign').mockImplementation(() => {
        throw new Error('Token generation error');
      });

      expect(() => service.generateToken(payload)).toThrow('Token generation error');
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', () => {
      const token = 'jwt-token-123';
      const decoded = { userId: '1', username: 'testuser' };

      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'verify').mockReturnValue(decoded);

      const result = service.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toEqual(decoded);
    });

    it('should handle invalid token', () => {
      const token = 'invalid-token';

      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.verifyToken(token)).toThrow('Invalid token');
    });
  });
});
