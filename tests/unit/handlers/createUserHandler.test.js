const CreateUserHandler = require('../../../src/core/services/features/user/command/createUserCommand/createUserHandler');
const User = require('../../../src/core/domain/user');

describe('CreateUserHandler', () => {
  let mockUserRepository;
  let mockAuthService;
  let handler;

  beforeEach(() => {
    mockUserRepository = {
      getByUsername: jest.fn(),
      create: jest.fn()
    };
    mockAuthService = {
      hashPassword: jest.fn()
    };
    handler = new CreateUserHandler(mockUserRepository, mockAuthService);
  });

  describe('handle', () => {
    it('should create user successfully', async () => {
      const command = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        lastName: 'User'
      };

      const hashedPassword = 'hashedpassword123';
      const createdUser = new User({
        id: '1',
        ...command,
        password: hashedPassword
      });

      mockUserRepository.getByUsername.mockResolvedValue(null);
      mockAuthService.hashPassword.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await handler.handle(command);

      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith('testuser');
      expect(mockAuthService.hashPassword).toHaveBeenCalledWith('password123');
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test',
          lastName: 'User'
        })
      );
      expect(result).toBeInstanceOf(User);
      expect(result.username).toBe('testuser');
    });

    it('should throw error if user already exists', async () => {
      const command = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };

      const existingUser = new User({
        id: '1',
        username: 'existinguser',
        email: 'existing@example.com'
      });

      mockUserRepository.getByUsername.mockResolvedValue(existingUser);

      await expect(handler.handle(command)).rejects.toThrow('A user with this username already exists');
      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith('existinguser');
      expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      mockUserRepository.getByUsername.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(command)).rejects.toThrow('Database error');
    });

    it('should handle auth service errors', async () => {
      const command = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      mockUserRepository.getByUsername.mockResolvedValue(null);
      mockAuthService.hashPassword.mockRejectedValue(new Error('Hashing error'));

      await expect(handler.handle(command)).rejects.toThrow('Hashing error');
    });

    it('should handle create user errors', async () => {
      const command = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const hashedPassword = 'hashedpassword123';

      mockUserRepository.getByUsername.mockResolvedValue(null);
      mockAuthService.hashPassword.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockRejectedValue(new Error('Create error'));

      await expect(handler.handle(command)).rejects.toThrow('Create error');
    });
  });
});
