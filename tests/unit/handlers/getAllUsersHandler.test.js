const GetAllUsersHandler = require('../../../src/core/services/features/user/queries/getAllUsersQuery/getAllUsersHandler');
const User = require('../../../src/core/domain/user');

describe('GetAllUsersHandler', () => {
  let handler;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      getAll: jest.fn()
    };
    handler = new GetAllUsersHandler(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return all users with pagination', async () => {
      const query = {
        pageSize: 10,
        lastVisible: null
      };

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
        lastVisible: null
      };

      mockUserRepository.getAll.mockResolvedValue(mockResult);

      const result = await handler.handle(query);

      expect(mockUserRepository.getAll).toHaveBeenCalledWith(10, null);
      expect(result).toEqual({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            username: 'user1',
            email: 'user1@example.com'
          }),
          expect.objectContaining({
            id: '2',
            username: 'user2',
            email: 'user2@example.com'
          })
        ]),
        lastVisible: null
      });
      expect(result.users).toHaveLength(2);
    });

    it('should handle query with startAfter parameter', async () => {
      const query = {
        pageSize: 5,
        lastVisible: 'someToken'
      };

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
      expect(result).toEqual({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: '3',
            username: 'user3',
            email: 'user3@example.com'
          })
        ]),
        lastVisible: 'newToken'
      });
    });

    it('should handle default pagination parameters', async () => {
      const query = {};

      const mockUsers = [
        new User({
          id: '1',
          username: 'user1',
          email: 'user1@example.com'
        })
      ];

      const mockResult = {
        users: mockUsers,
        lastVisible: null
      };

      mockUserRepository.getAll.mockResolvedValue(mockResult);

      const result = await handler.handle(query);

      expect(mockUserRepository.getAll).toHaveBeenCalledWith(10, null);
      expect(result.users).toHaveLength(1);
    });

    it('should return empty array when no users exist', async () => {
      const query = {
        pageSize: 10,
        lastVisible: null
      };

      const mockResult = {
        users: [],
        lastVisible: null
      };

      mockUserRepository.getAll.mockResolvedValue(mockResult);

      const result = await handler.handle(query);

      expect(result.users).toHaveLength(0);
      expect(result.lastVisible).toBeNull();
    });

    it('should handle repository errors', async () => {
      const query = {
        pageSize: 10,
        lastVisible: null
      };

      mockUserRepository.getAll.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });
  });
});