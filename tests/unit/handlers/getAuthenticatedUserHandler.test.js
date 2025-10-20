const GetAuthenticatedUserHandler = require('../../../src/core/services/features/user/queries/getAuthenticatedUserQuery/getAuthenticatedUserHandler');
const User = require('../../../src/core/domain/user');
const UserNotFoundError = require('../../../src/core/errors/userNotFoundError');

describe('GetAuthenticatedUserHandler', () => {
  let handler;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      getById: jest.fn()
    };
    handler = new GetAuthenticatedUserHandler(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return authenticated user when found', async () => {
      const query = {
        id: '1'
      };

      const mockUser = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      });

      mockUserRepository.getById.mockResolvedValue(mockUser);

      const result = await handler.handle(query);

      expect(mockUserRepository.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(expect.objectContaining({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      }));
    });

    it('should throw error when user not found', async () => {
      const query = {
        id: 'nonexistent'
      };

      mockUserRepository.getById.mockResolvedValue(null);

      await expect(handler.handle(query)).rejects.toThrow(UserNotFoundError);
      expect(mockUserRepository.getById).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle repository errors', async () => {
      const query = {
        id: '1'
      };

      mockUserRepository.getById.mockRejectedValue(new Error('Database error'));

      await expect(handler.handle(query)).rejects.toThrow('Database error');
    });

    it('should handle empty id', async () => {
      const query = {
        id: ''
      };

      mockUserRepository.getById.mockResolvedValue(null);

      await expect(handler.handle(query)).rejects.toThrow(UserNotFoundError);
    });

    it('should handle null id', async () => {
      const query = {
        id: null
      };

      mockUserRepository.getById.mockResolvedValue(null);

      await expect(handler.handle(query)).rejects.toThrow(UserNotFoundError);
    });

    it('should handle undefined id', async () => {
      const query = {
        id: undefined
      };

      mockUserRepository.getById.mockResolvedValue(null);

      await expect(handler.handle(query)).rejects.toThrow(UserNotFoundError);
    });

    it('should return user with all properties', async () => {
      const query = {
        id: '1'
      };

      const mockUser = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'admin',
        permissions: ['manage_users', 'view_reports']
      });

      mockUserRepository.getById.mockResolvedValue(mockUser);

      const result = await handler.handle(query);

      expect(result).toEqual(expect.objectContaining({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'admin',
        permissions: ['manage_users', 'view_reports']
      }));
    });
  });
});