const CreateUserHandler = require('../../../src/core/services/features/user/command/createUserCommand/createUserHandler');
const User = require('../../../src/core/domain/user');
const bcrypt = require('bcrypt');

// Mock bcrypt
jest.mock('bcrypt');

describe('CreateUserHandler', () => {
  let handler;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn()
    };
    handler = new CreateUserHandler(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create user successfully', async () => {
      const command = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        name: 'New',
        lastName: 'User'
      };

      const hashedPassword = 'hashedpassword123';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const mockCreatedUser = new User({
        id: '1',
        username: 'newuser',
        email: 'new@example.com',
        password: hashedPassword,
        name: 'New',
        lastName: 'User'
      });

      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      const result = await handler.handle(command);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...command,
        password: hashedPassword
      });
      expect(result).toEqual(expect.objectContaining({
        id: '1',
        username: 'newuser',
        email: 'new@example.com',
        name: 'New',
        lastName: 'User'
      }));
    });

    it('should throw error when password is missing', async () => {
      const command = {
        username: 'newuser',
        email: 'new@example.com'
        // Missing password
      };

      await expect(handler.handle(command)).rejects.toThrow('La contraseña es obligatoria');
    });

    it('should throw error when password is empty', async () => {
      const command = {
        username: 'newuser',
        email: 'new@example.com',
        password: ''
      };

      await expect(handler.handle(command)).rejects.toThrow('La contraseña es obligatoria');
    });

    it('should throw error when password is null', async () => {
      const command = {
        username: 'newuser',
        email: 'new@example.com',
        password: null
      };

      await expect(handler.handle(command)).rejects.toThrow('La contraseña es obligatoria');
    });

    it('should handle password hashing errors', async () => {
      const command = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };

      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

      await expect(handler.handle(command)).rejects.toThrow('Hashing error');
    });

    it('should handle repository errors', async () => {
      const command = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };

      const hashedPassword = 'hashedpassword123';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      mockUserRepository.create.mockRejectedValue(new Error('User already exists'));

      await expect(handler.handle(command)).rejects.toThrow('User already exists');
    });

    it('should create user with minimal data', async () => {
      const command = {
        username: 'minimaluser',
        email: 'minimal@example.com',
        password: 'password123'
      };

      const hashedPassword = 'hashedpassword123';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const mockCreatedUser = new User({
        id: '2',
        username: 'minimaluser',
        email: 'minimal@example.com',
        password: hashedPassword
      });

      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      const result = await handler.handle(command);

      expect(result).toEqual(expect.objectContaining({
        id: '2',
        username: 'minimaluser',
        email: 'minimal@example.com'
      }));
    });

    it('should create user with all optional fields', async () => {
      const command = {
        username: 'fulluser',
        email: 'full@example.com',
        password: 'password123',
        name: 'Full',
        lastName: 'User',
        role: 'admin',
        permissions: ['manage_users', 'view_reports']
      };

      const hashedPassword = 'hashedpassword123';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const mockCreatedUser = new User({
        id: '3',
        ...command,
        password: hashedPassword
      });

      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      const result = await handler.handle(command);

      expect(result).toEqual(expect.objectContaining({
        id: '3',
        username: 'fulluser',
        email: 'full@example.com',
        name: 'Full',
        lastName: 'User',
        role: 'admin',
        permissions: ['manage_users', 'view_reports']
      }));
    });
  });
});