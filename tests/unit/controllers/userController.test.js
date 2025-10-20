const UserController = require('../../../src/adapters/controllers/userController');

describe('UserController', () => {
  let mockCreateUserHandler;
  let mockUpdateUserHandler;
  let mockDeleteUserHandler;
  let mockGetUserByIdHandler;
  let mockGetUserByUsernameHandler;
  let mockGetAllUsersHandler;
  let mockGetAuthenticatedUserHandler;
  let controller;

  beforeEach(() => {
    mockCreateUserHandler = { handle: jest.fn() };
    mockUpdateUserHandler = { handle: jest.fn() };
    mockDeleteUserHandler = { handle: jest.fn() };
    mockGetUserByIdHandler = { handle: jest.fn() };
    mockGetUserByUsernameHandler = { handle: jest.fn() };
    mockGetAllUsersHandler = { handle: jest.fn() };
    mockGetAuthenticatedUserHandler = { handle: jest.fn() };
    
    controller = new UserController(
      mockCreateUserHandler,
      mockUpdateUserHandler,
      mockDeleteUserHandler,
      mockGetUserByIdHandler,
      mockGetUserByUsernameHandler,
      mockGetAllUsersHandler,
      mockGetAuthenticatedUserHandler
    );
  });

  describe('registerUser', () => {
    it('should register user successfully', async () => {
      const req = {
        body: {
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
          name: 'New',
          lastName: 'User'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = { id: '1', username: 'newuser', email: 'new@example.com' };
      mockCreateUserHandler.handle.mockResolvedValue(mockUser);

      await controller.registerUser(req, res);

      expect(mockCreateUserHandler.handle).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockUser
      });
    });

    it('should handle registration errors', async () => {
      const req = {
        body: {
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockCreateUserHandler.handle.mockRejectedValue(new Error('User already exists'));

      await controller.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User already exists'
      });
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      mockGetUserByIdHandler.handle.mockResolvedValue(mockUser);

      await controller.getUserById(req, res);

      expect(mockGetUserByIdHandler.handle).toHaveBeenCalledWith({ id: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockUser
      });
    });

    it('should handle user not found', async () => {
      const req = { params: { id: 'nonexistent' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockGetUserByIdHandler.handle.mockRejectedValue(new Error('Usuario no encontrado'));

      await controller.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Usuario no encontrado'
      });
    });
  });

  describe('getUserByUsername', () => {
    it('should return user by username', async () => {
      const req = { params: { username: 'testuser' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      mockGetUserByUsernameHandler.handle.mockResolvedValue(mockUser);

      await controller.getUserByUsername(req, res);

      expect(mockGetUserByUsernameHandler.handle).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockUser
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with pagination', async () => {
      const req = { query: { limit: '10', startAfter: 'someToken' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        users: [
          { id: '1', username: 'user1' },
          { id: '2', username: 'user2' }
        ],
        lastVisible: 'newToken'
      };
      mockGetAllUsersHandler.handle.mockResolvedValue(mockResult);

      await controller.getAllUsers(req, res);

      expect(mockGetAllUsersHandler.handle).toHaveBeenCalledWith({
        limit: 10,
        startAfter: 'someToken'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        users: mockResult.users,
        lastVisible: mockResult.lastVisible
      });
    });

    it('should handle default pagination parameters', async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockResult = {
        users: [],
        lastVisible: null
      };
      mockGetAllUsersHandler.handle.mockResolvedValue(mockResult);

      await controller.getAllUsers(req, res);

      expect(mockGetAllUsersHandler.handle).toHaveBeenCalledWith({
        limit: 10,
        startAfter: undefined
      });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const req = {
        params: { id: '1' },
        body: {
          name: 'Updated',
          email: 'updated@example.com'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = { id: '1', username: 'testuser', name: 'Updated' };
      mockUpdateUserHandler.handle.mockResolvedValue(mockUser);

      await controller.updateUser(req, res);

      expect(mockUpdateUserHandler.handle).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockUser
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockDeleteUserHandler.handle.mockResolvedValue(true);

      await controller.deleteUser(req, res);

      expect(mockDeleteUserHandler.handle).toHaveBeenCalledWith({ id: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should return authenticated user', async () => {
      const req = { user: { id: '1', username: 'testuser' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
      mockGetAuthenticatedUserHandler.handle.mockResolvedValue(mockUser);

      await controller.getAuthenticatedUser(req, res);

      expect(mockGetAuthenticatedUserHandler.handle).toHaveBeenCalledWith({ userId: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockUser
      });
    });
  });
});