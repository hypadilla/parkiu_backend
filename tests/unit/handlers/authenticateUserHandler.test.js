const AuthenticateUserHandler = require('../../../src/core/services/features/auth/command/authenticateUser/authenticateUserHandler');
const User = require('../../../src/core/domain/user');

describe('AuthenticateUserHandler', () => {
  let handler;
  let mockAuthService;

  beforeEach(() => {
    mockAuthService = {
      authenticate: jest.fn()
    };
    handler = new AuthenticateUserHandler(mockAuthService);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should authenticate user successfully', async () => {
      const command = {
        username: 'testuser',
        password: 'password123'
      };

      const mockUser = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      });

      const mockToken = 'jwt-token';

      mockAuthService.authenticate.mockResolvedValue({
        user: mockUser,
        token: mockToken
      });

      const result = await handler.handle(command);

      expect(mockAuthService.authenticate).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
      expect(result).toEqual({
        userClient: expect.objectContaining({
          id: '1',
          username: 'testuser',
          email: 'test@example.com'
        }),
        token: 'jwt-token'
      });
    });

    it('should handle authentication errors', async () => {
      const command = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      mockAuthService.authenticate.mockRejectedValue(new Error('Invalid credentials'));

      await expect(handler.handle(command)).rejects.toThrow('Invalid credentials');
    });

    it('should handle missing username', async () => {
      const command = {
        username: '',
        password: 'password123'
      };

      mockAuthService.authenticate.mockRejectedValue(new Error('Username is required'));

      await expect(handler.handle(command)).rejects.toThrow('Username is required');
    });

    it('should handle missing password', async () => {
      const command = {
        username: 'testuser',
        password: ''
      };

      mockAuthService.authenticate.mockRejectedValue(new Error('Password is required'));

      await expect(handler.handle(command)).rejects.toThrow('Password is required');
    });

    it('should handle auth service errors', async () => {
      const command = {
        username: 'testuser',
        password: 'password123'
      };

      mockAuthService.authenticate.mockRejectedValue(new Error('Database connection failed'));

      await expect(handler.handle(command)).rejects.toThrow('Database connection failed');
    });
  });
});