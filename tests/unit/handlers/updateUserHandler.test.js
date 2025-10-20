const UpdateUserHandler = require('../../../src/core/services/features/user/command/updateUserCommand/updateUserHandler');
const User = require('../../../src/core/domain/user');
const bcrypt = require('bcrypt');

// Mock bcrypt
jest.mock('bcrypt');

describe('UpdateUserHandler', () => {
  let handler;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      update: jest.fn()
    };
    handler = new UpdateUserHandler(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update user successfully', async () => {
      const command = {
        id: '1',
        name: 'Updated',
        email: 'updated@example.com'
      };

      const mockUpdatedUser = new User({
        id: '1',
        username: 'testuser',
        name: 'Updated',
        email: 'updated@example.com'
      });

      mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

      const result = await handler.handle(command);

      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        name: 'Updated',
        email: 'updated@example.com'
      });
      expect(result).toEqual(expect.objectContaining({
        id: '1',
        username: 'testuser',
        email: 'updated@example.com'
      }));
      expect(result.name).toBe('Updated');
    });

    it('should update user with password hashing', async () => {
      const command = {
        id: '1',
        password: 'newpassword123'
      };

      const hashedPassword = 'hashedpassword123';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const mockUpdatedUser = new User({
        id: '1',
        username: 'testuser',
        password: hashedPassword
      });

      mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

      const result = await handler.handle(command);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        password: hashedPassword
      });
      expect(result).toEqual(expect.objectContaining({
        id: '1',
        username: 'testuser'
      }));
    });

    it('should throw error when user id is missing', async () => {
      const command = {
        name: 'Updated'
        // Missing id
      };

      await expect(handler.handle(command)).rejects.toThrow('El ID del usuario es obligatorio');
    });

    it('should handle password hashing errors', async () => {
      const command = {
        id: '1',
        password: 'newpassword123'
      };

      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

      await expect(handler.handle(command)).rejects.toThrow('Hashing error');
    });

    it('should update user with all fields', async () => {
      const command = {
        id: '1',
        name: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
        role: 'admin',
        permissions: ['manage_users'],
        password: 'newpassword123'
      };

      const hashedPassword = 'hashedpassword123';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const mockUpdatedUser = new User({
        id: '1',
        username: 'testuser',
        name: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
        role: 'admin',
        permissions: ['manage_users'],
        password: hashedPassword
      });

      mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

      const result = await handler.handle(command);

      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        name: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
        role: 'admin',
        permissions: ['manage_users'],
        password: hashedPassword
      });
      expect(result).toEqual(expect.objectContaining({
        id: '1',
        username: 'testuser',
        email: 'updated@example.com'
      }));
    });

    it('should handle repository errors', async () => {
      const command = {
        id: '1',
        name: 'Updated'
      };

      mockUserRepository.update.mockRejectedValue(new Error('Repository error'));

      await expect(handler.handle(command)).rejects.toThrow('Repository error');
    });
  });
});