const AuthenticateUserHandler = require('../../../src/core/services/features/auth/command/authenticateUser/authenticateUserHandler');
const User = require('../../../src/core/domain/user');

describe('AuthenticateUserHandler', () => {
  let mockUserRepository;
  let mockAuthService;
  let handler;

  beforeEach(() => {
    mockUserRepository = {
      getByUsername: jest.fn()
    };
    mockAuthService = {
      comparePassword: jest.fn(),
      generateToken: jest.fn()
    };
    handler = new AuthenticateUserHandler(mockUserRepository, mockAuthService);
  });

  describe('handle', () => {
    it('should authenticate user successfully', async () => {
      const command = {
        username: 'testuser',
        password: 'password123'
      };

      const user = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword123'
      });

      const token = 'jwt-token-123';

      mockUserRepository.getByUsername.mockResolvedValue(user);
      mockAuthService.comparePassword.mockResolvedValue(true);
      mockAuthService.generateToken.mockResolvedValue(token);

      const result = await handler.handle(command);

      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith('testuser');
      expect(mockAuthService.comparePassword).toHaveBeenCalledWith('password123', 'hashedpassword123');
      expect(mockAuthService.generateToken).toHaveBeenCalledWith({ userId: '1', username: 'testuser' });
      expect(result).toEqual({
        user: expect.objectContaining({
          id: '1',
          username: 'testuser',
          email: 'test@example.com'
        }),
        token: 'jwt-token-123'
      });
    });

    it('should throw error if user not found', async () => {
      const command = {
        username: 'nonexistent',
        password: 'password123'
      };

      mockUserRepository.getByUsername.mockResolvedValue(null);

      await expect(handler.handle(command)).rejects.toThrow('Usuario no encontrado');
      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith('nonexistent');
      expect(mockAuthService.comparePassword).not.toHaveBeenCalled();
      expect(mockAuthService.generateToken).not.toHaveBeenCalled();
    });

    it('should throw error if password is incorrect', async () => {
      const command = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const user = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword123'
      });

      mockUserRepository.getByUsername.mockResolvedValue(user);
      mockAuthService.comparePassword.mockResolvedValue(false);

      await expect(handler.handle(command)).rejects.toThrow('Credenciales inválidas');
      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith('testuser');
      expect(mockAuthService.comparePassword).toHaveBeenCalledWith('wrongpassword', 'hashedpassword123');
      expect(mockAuthService.generateToken).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command = {
        username: 'testuser',
        password: 'password123'
      };

      mockUserRepository.getByUsername.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(command)).rejects.toThrow('Database error');
    });

    it('should handle auth service errors', async () => {
      const command = {
        username: 'testuser',
        password: 'password123'
      };

      const user = new User({
        id: '1',
        username: 'testuser',
        password: 'hashedpassword123'
      });

      mockUserRepository.getByUsername.mockResolvedValue(user);
      mockAuthService.comparePassword.mockRejectedValue(new Error('Compare error'));

      await expect(handler.handle(command)).rejects.toThrow('Compare error');
    });

    it('should handle token generation errors', async () => {
      const command = {
        username: 'testuser',
        password: 'password123'
      };

      const user = new User({
        id: '1',
        username: 'testuser',
        password: 'hashedpassword123'
      });

      mockUserRepository.getByUsername.mockResolvedValue(user);
      mockAuthService.comparePassword.mockResolvedValue(true);
      mockAuthService.generateToken.mockRejectedValue(new Error('Token error'));

      await expect(handler.handle(command)).rejects.toThrow('Token error');
    });
  });
});
