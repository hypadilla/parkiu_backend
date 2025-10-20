const GetUserByUsernameHandler = require('../../../src/core/services/features/user/queries/getUserByUsernameQuery/getUserByUsernameHandler');
const User = require('../../../src/core/domain/user');

describe('GetUserByUsernameHandler', () => {
  let mockUserRepository;
  let handler;

  beforeEach(() => {
    mockUserRepository = {
      getByUsername: jest.fn()
    };
    handler = new GetUserByUsernameHandler(mockUserRepository);
  });

  describe('handle', () => {
    it('should return user when found', async () => {
      const query = { username: 'testuser' };
      const userData = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'USER',
        permissions: ['CAN_VIEW']
      };

      const user = new User(userData);
      mockUserRepository.getByUsername.mockResolvedValue(user);

      const result = await handler.handle(query);

      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith('testuser');
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('1');
      expect(result.username).toBe('testuser');
    });

    it('should throw error when user not found', async () => {
      const query = { username: 'nonexistent' };

      mockUserRepository.getByUsername.mockResolvedValue(null);

      await expect(handler.handle(query)).rejects.toThrow('Usuario no encontrado');
      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle repository errors', async () => {
      const query = { username: 'testuser' };

      mockUserRepository.getByUsername.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });
  });
});
