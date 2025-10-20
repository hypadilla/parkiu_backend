const UpdateUserHandler = require('../../../src/core/services/features/user/command/updateUserCommand/updateUserHandler');
const User = require('../../../src/core/domain/user');

describe('UpdateUserHandler', () => {
  let mockUserRepository;
  let mockAuthService;
  let handler;

  beforeEach(() => {
    mockUserRepository = {
      getById: jest.fn(),
      update: jest.fn()
    };
    mockAuthService = {
      hashPassword: jest.fn()
    };
    handler = new UpdateUserHandler(mockUserRepository, mockAuthService);
  });

  describe('handle', () => {
    it('should update user successfully', async () => {
      const command = {
        id: '1',
        updateData: {
          name: 'Updated',
          email: 'updated@example.com'
        }
      };

      const existingUser = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User'
      });

      const updatedUser = new User({
        id: '1',
        username: 'testuser',
        email: 'updated@example.com',
        name: 'Updated',
        lastName: 'User'
      });

      mockUserRepository.getById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await handler.handle(command);

      expect(mockUserRepository.getById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', command.updateData);
      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe('Updated');
      expect(result.email).toBe('updated@example.com');
    });

    it('should update user with password hashing', async () => {
      const command = {
        id: '1',
        updateData: {
          password: 'newpassword123'
        }
      };

      const existingUser = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      });

      const hashedPassword = 'hashednewpassword123';
      const updatedUser = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword
      });

      mockUserRepository.getById.mockResolvedValue(existingUser);
      mockAuthService.hashPassword.mockResolvedValue(hashedPassword);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await handler.handle(command);

      expect(mockAuthService.hashPassword).toHaveBeenCalledWith('newpassword123');
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        password: hashedPassword
      });
      expect(result).toBeInstanceOf(User);
    });

    it('should throw error when user not found', async () => {
      const command = {
        id: 'nonexistent',
        updateData: {
          name: 'Updated'
        }
      };

      mockUserRepository.getById.mockResolvedValue(null);

      await expect(handler.handle(command)).rejects.toThrow('Usuario no encontrado');
      expect(mockUserRepository.getById).toHaveBeenCalledWith('nonexistent');
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command = {
        id: '1',
        updateData: {
          name: 'Updated'
        }
      };

      const existingUser = new User({
        id: '1',
        username: 'testuser'
      });

      mockUserRepository.getById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockRejectedValue(new Error('Update error'));

      await expect(handler.handle(command)).rejects.toThrow('Update error');
    });

    it('should handle password hashing errors', async () => {
      const command = {
        id: '1',
        updateData: {
          password: 'newpassword123'
        }
      };

      const existingUser = new User({
        id: '1',
        username: 'testuser'
      });

      mockUserRepository.getById.mockResolvedValue(existingUser);
      mockAuthService.hashPassword.mockRejectedValue(new Error('Hashing error'));

      await expect(handler.handle(command)).rejects.toThrow('Hashing error');
    });
  });
});