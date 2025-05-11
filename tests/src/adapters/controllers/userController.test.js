const request = require('supertest');
const express = require('express');
const UserController = require('../../../../src/adapters/controllers/userController');

const CreateUserHandler = require('../../../../src/core/services/features/user/command/createUserCommand/createUserHandler');
const GetAuthenticatedUserHandler = require('../../../../src/core/services/features/user/queries/getAuthenticatedUserQuery/getAuthenticatedUserHandler');
const DeleteUserHandler = require('../../../../src/core/services/features/user/command/deleteUserCommand/deleteUserHandler');
const UpdateUserHandler = require('../../../../src/core/services/features/user/command/updateUserCommand/updateUserHandler');
const GetUserByIdHandler = require('../../../../src/core/services/features/user/queries/getUserByIdQuery/getUserByIdHandler');
const GetUserByUsernameHandler = require('../../../../src/core/services/features/user/queries/getUserByUsernameQuery/getUserByUsernameHandler');
const GetAllUsersHandler = require('../../../../src/core/services/features/user/queries/getAllUsersQuery/getAllUsersHandler');

const UserAlreadyExistsError = require('../../../../src/core/errors/userAlreadyExistsError');
const UserNotFoundError = require('../../../../src/core/errors/userNotFoundError');

const logger = require('../../../../src/core/utils/logger');

jest.mock('../../../../src/core/services/features/user/command/createUserCommand/createUserHandler');
jest.mock('../../../../src/core/services/features/user/queries/getAuthenticatedUserQuery/getAuthenticatedUserHandler');
jest.mock('../../../../src/core/services/features/user/command/deleteUserCommand/deleteUserHandler');
jest.mock('../../../../src/core/services/features/user/command/updateUserCommand/updateUserHandler');
jest.mock('../../../../src/core/services/features/user/queries/getUserByIdQuery/getUserByIdHandler');
jest.mock('../../../../src/core/services/features/user/queries/getUserByUsernameQuery/getUserByUsernameHandler');
jest.mock('../../../../src/core/services/features/user/queries/getAllUsersQuery/getAllUsersHandler');
jest.mock('../../../../src/core/utils/logger');

describe('UserController', () => {
  let app;
  let userController;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    userController = new UserController(
      new CreateUserHandler(),
      new GetAuthenticatedUserHandler(),
      new DeleteUserHandler(),
      new UpdateUserHandler(),
      new GetUserByIdHandler(),
      new GetUserByUsernameHandler(),
      new GetAllUsersHandler()
    );

    app.post('/api/auth/register', (req, res) => userController.registerUser(req, res));
    app.get('/api/auth/me', (req, res) => userController.getAuthenticatedUser(req, res));
    app.delete('/api/users/:id', (req, res) => userController.deleteUser(req, res));
    app.put('/api/users/:id', (req, res) => userController.updateUser(req, res));
    app.get('/api/users/:id', (req, res) => userController.getUserById(req, res));
    app.get('/api/users/username/:username', (req, res) => userController.getUserByUsername(req, res));
    app.get('/api/users', (req, res) => userController.getAllUsers(req, res));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // POST /api/auth/register
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = { id: 1, username: 'testuser', email: 'test@example.com' };
      CreateUserHandler.prototype.handle.mockResolvedValue(userData);

      const response = await request(app).post('/api/auth/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuario registrado exitosamente');
      expect(response.body.user).toEqual(userData);
      expect(logger.info).toHaveBeenCalledWith('Usuario creado exitosamente', { userId: userData.id, username: userData.username });
    });

    it('should return error if user already exists', async () => {
      const userData = { id: 1, username: 'testuser', email: 'test@example.com' };
      const error = new UserAlreadyExistsError('username', 'username');
      CreateUserHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).post('/api/auth/register').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('El nombre de usuario ya está en uso');
      expect(response.body.error.type).toBe('usernameConflict');
    });

    it('should return error for unexpected issues', async () => {
      const userData = { id: 1, username: 'testuser', email: 'test@example.com' };
      const error = new Error('Unexpected error');
      CreateUserHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).post('/api/auth/register').send(userData);

      expect(response.status).toBe(500);
      expect(response.body.error.message).toBe('Ocurrió un error al procesar la solicitud');
    });
  });

  // GET /api/auth/me
  describe('GET /api/auth/me', () => {
    it('should return the authenticated user', async () => {
      const userData = { id: 1, username: 'testuser', email: 'test@example.com' };
      GetAuthenticatedUserHandler.prototype.handle.mockResolvedValue(userData);

      const req = { user: { id: 1 } };
      app.get('/mock/me', (req, res) => userController.getAuthenticatedUser({ ...req, user: { id: 1 } }, res));
      const response = await request(app).get('/mock/me');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(userData);
    });

    it('should return 401 for unauthorized user', async () => {
      const error = new Error('Unauthorized');
      GetAuthenticatedUserHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No autorizado');
    });
  });

  // DELETE /api/users/:id
  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      DeleteUserHandler.prototype.handle.mockResolvedValue();

      const response = await request(app).delete('/api/users/123');

      expect(response.status).toBe(204);
      expect(logger.info).toHaveBeenCalledWith('Usuario eliminado exitosamente', { userId: '123' });
    });

    it('should return 404 if user not found', async () => {
      const error = new UserNotFoundError('123');
      DeleteUserHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).delete('/api/users/123');

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('El usuario no fue encontrado');
      expect(response.body.error.type).toBe('userNotFound');
    });

    it('should return 500 for unexpected errors during deletion', async () => {
      const error = new Error('Unexpected delete error');
      DeleteUserHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).delete('/api/users/123');

      expect(response.status).toBe(500);
      expect(response.body.error.message).toBe('Ocurrió un error al procesar la solicitud');
    });
  });

  // PUT /api/users/:id
  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      const userData = { username: 'updateduser' };
      const updatedUser = { id: 1, username: 'updateduser', email: 'test@example.com' };
      UpdateUserHandler.prototype.handle.mockResolvedValue(updatedUser);

      const response = await request(app).put('/api/users/1').send(userData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuario actualizado exitosamente');
      expect(response.body.user).toEqual(updatedUser);
    });

    it('should return 404 if user not found for update', async () => {
      const error = new UserNotFoundError('1');
      UpdateUserHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).put('/api/users/1').send({ username: 'updateduser' });

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('El usuario no fue encontrado');
      expect(response.body.error.type).toBe('userNotFound');
    });

    it('should return 500 for unexpected errors during update', async () => {
      const error = new Error('Unexpected update error');
      UpdateUserHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).put('/api/users/1').send({ username: 'updateduser' });

      expect(response.status).toBe(500);
      expect(response.body.error.message).toBe('Ocurrió un error al procesar la solicitud');
    });
  });

  // GET /api/users/:id
  describe('GET /api/users/:id', () => {
    it('should get user by ID', async () => {
      const userData = { id: 1, username: 'testuser', email: 'test@example.com' };
      GetUserByIdHandler.prototype.handle.mockResolvedValue(userData);

      const response = await request(app).get('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(userData);
    });

    it('should return 404 if user not found', async () => {
      const error = new UserNotFoundError('1');
      GetUserByIdHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).get('/api/users/1');

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('El usuario no fue encontrado');
      expect(response.body.error.type).toBe('userNotFound');
    });
  });

  // GET /api/users/username/:username
  describe('GET /api/users/username/:username', () => {
    it('should get user by username', async () => {
      const userData = { id: 1, username: 'testuser', email: 'test@example.com' };
      GetUserByUsernameHandler.prototype.handle.mockResolvedValue(userData);

      const response = await request(app).get('/api/users/username/testuser');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(userData);
    });

    it('should return 404 if user by username not found', async () => {
      const error = new UserNotFoundError('testuser');
      GetUserByUsernameHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).get('/api/users/username/testuser');

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('El usuario no fue encontrado');
      expect(response.body.error.type).toBe('userNotFound');
    });
  });

  // GET /api/users
  describe('GET /api/users', () => {
    it('should get all users', async () => {
      const usersData = [
        { id: 1, username: 'user1', email: 'user1@example.com' },
        { id: 2, username: 'user2', email: 'user2@example.com' },
      ];
      GetAllUsersHandler.prototype.handle.mockResolvedValue(usersData);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(usersData);
    });

    it('should return 500 for unexpected errors during fetching users', async () => {
      const error = new Error('Unexpected error fetching users');
      GetAllUsersHandler.prototype.handle.mockRejectedValue(error);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body.error.message).toBe('Ocurrió un error al procesar la solicitud');
    });
  });
});
