const GetAllUsersHandler = require('../../../src/core/services/features/user/queries/getAllUsersQuery/getAllUsersHandler');
const User = require('../../../src/core/domain/user');

describe('GetAllUsersHandler', () => {
  let mockUserRepository;
  let handler;

  beforeEach(() => {
    mockUserRepository = {
      getAll: jest.fn()
    };
    handler = new GetAllUsersHandler(mockUserRepository);
  });

  describe('handle', () => {
    it('should return all users with pagination', async () => {
      const query = { limit: 10, startAfter: null };
      const mockUsers = [
        new User({
          id: '1',
          username: 'user1',
          email: 'user1@example.com'
        }),
        new User({
          id: '2',
          username: 'user2',
          email: 'user2@example.com'
        })
      ];

      const mockResult = {
        users: mockUsers,
        lastVisible: 'lastVisibleToken'
      };

      mockUserRepository.getAll.mockResolvedValue(mockResult);

      const result = await handler.handle(query);

      expect(mockUserRepository.getAll).toHaveBeenCalledWith(10, null);
      expect(result).toEqual(mockResult);
      expect(result.users).toHaveLength(2);
    });

    it('should return empty result when no users exist', async () => {
      const query = { limit: 10, startAfter: null };
      const mockResult = {
        users: [],
        lastVisible: null
      };

      mockUserRepository.getAll.mockResolvedValue(mockResult);

      const result = await handler.handle(query);

      expect(mockUserRepository.getAll).toHaveBeenCalledWith(10, null);
      expect(result).toEqual(mockResult);
      expect(result.users).toHaveLength(0);
    });

    it('should handle repository errors', async () => {
      const query = { limit: 10, startAfter: null };

      mockUserRepository.getAll.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });

    it('should handle query with startAfter parameter', async () => {
      const query = { limit: 5, startAfter: 'someToken' };
      const mockUsers = [
        new User({
          id: '3',
          username: 'user3',
          email: 'user3@example.com'
        })
      ];

      const mockResult = {
        users: mockUsers,
        lastVisible: 'newToken'
      };

      mockUserRepository.getAll.mockResolvedValue(mockResult);

      const result = await handler.handle(query);

      expect(mockUserRepository.getAll).toHaveBeenCalledWith(5, 'someToken');
      expect(result).toEqual(mockResult);
    });
  });
});
