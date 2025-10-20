const UserController = require('../../../src/adapters/controllers/userController');
const CreateUserCommand = require('../../../src/core/services/features/user/command/createUserCommand/createUserCommand');
const UpdateUserCommand = require('../../../src/core/services/features/user/command/updateUserCommand/updateUserCommand');
const DeleteUserCommand = require('../../../src/core/services/features/user/command/deleteUserCommand/deleteUserCommand');
const GetAuthenticatedUserQuery = require('../../../src/core/services/features/user/queries/getAuthenticatedUserQuery/getAuthenticatedUserQuery');
const GetUserByIdQuery = require('../../../src/core/services/features/user/queries/getUserByIdQuery/getUserByIdQuery');
const GetUserByUsernameQuery = require('../../../src/core/services/features/user/queries/getUserByUsernameQuery/getUserByUsernameQuery');
const GetAllUsersQuery = require('../../../src/core/services/features/user/queries/getAllUsersQuery/getAllUsersQuery');
const UserAlreadyExistsError = require('../../../src/core/errors/userAlreadyExistsError');
const UserNotFoundError = require('../../../src/core/errors/userNotFoundError');

describe('UserController', () => {
  let controller;
  let mockCreateUserHandler;
  let mockUpdateUserHandler;
  let mockDeleteUserHandler;
  let mockGetAuthenticatedUserHandler;
  let mockGetUserByIdHandler;
  let mockGetUserByUsernameHandler;
  let mockGetAllUsersHandler;

  beforeEach(() => {
    mockCreateUserHandler = {
      handle: jest.fn()
    };
    mockUpdateUserHandler = {
      handle: jest.fn()
    };
    mockDeleteUserHandler = {
      handle: jest.fn()
    };
    mockGetAuthenticatedUserHandler = {
      handle: jest.fn()
    };
    mockGetUserByIdHandler = {
      handle: jest.fn()
    };
    mockGetUserByUsernameHandler = {
      handle: jest.fn()
    };
    mockGetAllUsersHandler = {
      handle: jest.fn()
    };

    controller = new UserController(
      mockCreateUserHandler,
      mockUpdateUserHandler,
      mockDeleteUserHandler,
      mockGetAuthenticatedUserHandler,
      mockGetUserByIdHandler,
      mockGetUserByUsernameHandler,
      mockGetAllUsersHandler
    );

    jest.clearAllMocks();
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

      const mockUser = {
        id: '1',
        username: 'newuser',
        email: 'new@example.com'
      };

      mockCreateUserHandler.handle.mockResolvedValue(mockUser);

      await controller.registerUser(req, res);

      expect(mockCreateUserHandler.handle).toHaveBeenCalledWith(expect.any(CreateUserCommand));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario registrado exitosamente',
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

      mockCreateUserHandler.handle.mockRejectedValue(new UserAlreadyExistsError('username'));

      await controller.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
              error: expect.objectContaining({
                message: 'El nombre de usuario ya está en uso'
              })
            });
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const req = {
        params: { id: '1' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      };

      mockGetUserByIdHandler.handle.mockResolvedValue(mockUser);

      await controller.getUserById(req, res);

      expect(mockGetUserByIdHandler.handle).toHaveBeenCalledWith(expect.any(GetUserByIdQuery));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      }));
    });

    it('should handle user not found', async () => {
      const req = {
        params: { id: 'nonexistent' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockGetUserByIdHandler.handle.mockRejectedValue(new Error('Usuario no encontrado'));

      await controller.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.objectContaining({
          message: 'Ocurrió un error al procesar la solicitud'
        })
      });
    });
  });

  describe('getUserByUsername', () => {
    it('should return user by username', async () => {
      const req = {
        params: { username: 'testuser' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      };

      mockGetUserByUsernameHandler.handle.mockResolvedValue(mockUser);

      await controller.getUserByUsername(req, res);

      expect(mockGetUserByUsernameHandler.handle).toHaveBeenCalledWith(expect.any(GetUserByUsernameQuery));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      }));
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with pagination', async () => {
      const req = {
        query: {
          limit: 10,
          startAfter: 'someToken'
        }
      };

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

      expect(mockGetAllUsersHandler.handle).toHaveBeenCalledWith(expect.any(GetAllUsersQuery));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            username: 'user1'
          }),
          expect.objectContaining({
            id: '2',
            username: 'user2'
          })
        ]),
        lastVisible: null
      });
    });

    it('should handle default pagination parameters', async () => {
      const req = {
        query: {}
      };

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

      expect(mockGetAllUsersHandler.handle).toHaveBeenCalledWith(expect.any(GetAllUsersQuery));
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const req = {
        params: { id: '1' },
        body: {
          email: 'updated@example.com',
          name: 'Updated'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUpdatedUser = {
        id: '1',
        username: 'testuser',
        email: 'updated@example.com',
        name: 'Updated'
      };

      mockUpdateUserHandler.handle.mockResolvedValue(mockUpdatedUser);

      await controller.updateUser(req, res);

      expect(mockUpdateUserHandler.handle).toHaveBeenCalledWith(expect.any(UpdateUserCommand));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario actualizado exitosamente',
        user: expect.objectContaining({
          id: '1',
          email: 'updated@example.com',
          name: 'Updated'
        })
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const req = {
        params: { id: '1' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockDeleteUserHandler.handle.mockResolvedValue(true);

      await controller.deleteUser(req, res);

      expect(mockDeleteUserHandler.handle).toHaveBeenCalledWith(expect.any(DeleteUserCommand));
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should return authenticated user', async () => {
      const req = {
        user: { id: '1' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      };

      mockGetAuthenticatedUserHandler.handle.mockResolvedValue(mockUser);

      await controller.getAuthenticatedUser(req, res);

      expect(mockGetAuthenticatedUserHandler.handle).toHaveBeenCalledWith(expect.any(GetAuthenticatedUserQuery));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      }));
    });
  });
});