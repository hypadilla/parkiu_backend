const GetAuthenticatedUserHandler = require('../../../src/core/services/features/user/queries/getAuthenticatedUserQuery/getAuthenticatedUserHandler');
const User = require('../../../src/core/domain/user');

describe('GetAuthenticatedUserHandler', () => {
  let mockUserRepository;
  let handler;

  beforeEach(() => {
    mockUserRepository = {
      getById: jest.fn()
    };
    handler = new GetAuthenticatedUserHandler(mockUserRepository);
  });

  describe('handle', () => {
    it('should return authenticated user', async () => {
      const query = { userId: '1' };
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
      mockUserRepository.getById.mockResolvedValue(user);

      const result = await handler.handle(query);

      expect(mockUserRepository.getById).toHaveBeenCalledWith('1');
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('1');
      expect(result.username).toBe('testuser');
    });

    it('should throw error when user not found', async () => {
      const query = { userId: 'nonexistent' };

      mockUserRepository.getById.mockResolvedValue(null);

      await expect(handler.handle(query)).rejects.toThrow('Usuario no encontrado');
      expect(mockUserRepository.getById).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle repository errors', async () => {
      const query = { userId: '1' };

      mockUserRepository.getById.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });

    it('should handle user with minimal data', async () => {
      const query = { userId: '2' };
      const userData = {
        id: '2',
        username: 'minimaluser'
      };

      const user = new User(userData);
      mockUserRepository.getById.mockResolvedValue(user);

      const result = await handler.handle(query);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('2');
      expect(result.username).toBe('minimaluser');
      expect(result.email).toBeUndefined();
    });
  });
});
