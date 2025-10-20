const DeleteUserHandler = require('../../../src/core/services/features/user/command/deleteUserCommand/deleteUserHandler');
const User = require('../../../src/core/domain/user');

describe('DeleteUserHandler', () => {
  let mockUserRepository;
  let handler;

  beforeEach(() => {
    mockUserRepository = {
      getById: jest.fn(),
      delete: jest.fn()
    };
    handler = new DeleteUserHandler(mockUserRepository);
  });

  describe('handle', () => {
    it('should delete user successfully', async () => {
      const command = { id: '1' };
      const userData = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      };

      const user = new User(userData);
      mockUserRepository.getById.mockResolvedValue(user);
      mockUserRepository.delete.mockResolvedValue(true);

      const result = await handler.handle(command);

      expect(mockUserRepository.getById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should throw error when user not found', async () => {
      const command = { id: 'nonexistent' };

      mockUserRepository.getById.mockResolvedValue(null);

      await expect(handler.handle(command)).rejects.toThrow('Usuario no encontrado');
      expect(mockUserRepository.getById).toHaveBeenCalledWith('nonexistent');
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const command = { id: '1' };
      const userData = {
        id: '1',
        username: 'testuser'
      };

      const user = new User(userData);
      mockUserRepository.getById.mockResolvedValue(user);
      mockUserRepository.delete.mockRejectedValue(new Error('Delete error'));

      await expect(handler.handle(command)).rejects.toThrow('Delete error');
    });

    it('should handle getById errors', async () => {
      const command = { id: '1' };

      mockUserRepository.getById.mockRejectedValue(new Error('GetById error'));

      await expect(handler.handle(command)).rejects.toThrow('GetById error');
    });
  });
});
