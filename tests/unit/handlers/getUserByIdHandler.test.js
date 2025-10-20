const GetUserByIdHandler = require('../../../src/core/services/features/user/queries/getUserByIdQuery/getUserByIdHandler');
const User = require('../../../src/core/domain/user');

describe('GetUserByIdHandler', () => {
  let mockUserRepository;
  let handler;

  beforeEach(() => {
    mockUserRepository = {
      getById: jest.fn()
    };
    handler = new GetUserByIdHandler(mockUserRepository);
  });

  describe('handle', () => {
    it('should return user when found', async () => {
      const query = { id: '1' };
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
      const query = { id: 'nonexistent' };

      mockUserRepository.getById.mockResolvedValue(null);

      await expect(handler.handle(query)).rejects.toThrow('Usuario no encontrado');
      expect(mockUserRepository.getById).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle repository errors', async () => {
      const query = { id: '1' };

      mockUserRepository.getById.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });
  });
});
