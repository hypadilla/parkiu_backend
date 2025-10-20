const GetUserByUsernameHandler = require('../../../src/core/services/features/user/queries/getUserByUsernameQuery/getUserByUsernameHandler');
const User = require('../../../src/core/domain/user');
const UserNotFoundError = require('../../../src/core/errors/userNotFoundError');

describe('GetUserByUsernameHandler', () => {
  let handler;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      getByUsername: jest.fn()
    };
    handler = new GetUserByUsernameHandler(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return user when found', async () => {
      const query = {
        username: 'testuser'
      };

      const mockUser = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      });

      mockUserRepository.getByUsername.mockResolvedValue(mockUser);

      const result = await handler.handle(query);

      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(expect.objectContaining({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      }));
    });

    it('should throw error when user not found', async () => {
      const query = {
        username: 'nonexistent'
      };

      mockUserRepository.getByUsername.mockResolvedValue(null);

      await expect(handler.handle(query)).rejects.toThrow(UserNotFoundError);
      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle repository errors', async () => {
      const query = {
        username: 'testuser'
      };

      mockUserRepository.getByUsername.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });

    it('should handle empty username', async () => {
      const query = {
        username: ''
      };

      mockUserRepository.getByUsername.mockResolvedValue(null);

      await expect(handler.handle(query)).rejects.toThrow(UserNotFoundError);
    });
  });
});