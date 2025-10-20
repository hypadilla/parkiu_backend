const DeleteUserHandler = require('../../../src/core/services/features/user/command/deleteUserCommand/deleteUserHandler');

describe('DeleteUserHandler', () => {
  let handler;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      delete: jest.fn()
    };
    handler = new DeleteUserHandler(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete user successfully', async () => {
      const command = {
        id: '1'
      };

      mockUserRepository.delete.mockResolvedValue(true);

      const result = await handler.handle(command);

      expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should return false when user not found', async () => {
      const command = {
        id: 'nonexistent'
      };

      mockUserRepository.delete.mockResolvedValue(false);

      const result = await handler.handle(command);

      expect(mockUserRepository.delete).toHaveBeenCalledWith('nonexistent');
      expect(result).toBe(false);
    });

    it('should handle repository errors', async () => {
      const command = {
        id: '1'
      };

      mockUserRepository.delete.mockRejectedValue(new Error('Repository error'));

      await expect(handler.handle(command)).rejects.toThrow('Repository error');
    });

    it('should handle missing id', async () => {
      const command = {
        // Missing id
      };

      mockUserRepository.delete.mockResolvedValue(false);

      const result = await handler.handle(command);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(undefined);
      expect(result).toBe(false);
    });
  });
});