const express = require("express");
const { authMiddleware } = require('../middlewares/auth/authMiddleware');
const UserController = require("../controllers/userController");
const UserRepository = require("../../infrastructure/repositories/userRepository");
const requirePermission = require('../middlewares/auth/requirePermission');
const { PERMISSIONS } = require('../../config/permissions');
const { validateUserRegister, validateUserUpdate, validateUserDelete, validateGetUserId, validateGetUserUsername } = require('../middlewares/user/userMiddleware');

const CreateUserHandler = require("../../core/services/features/user/command/createUserCommand/createUserHandler");
const UpdateUserHandler = require("../../core/services/features/user/command/updateUserCommand/updateUserHandler");
const DeleteUserHandler = require("../../core/services/features/user/command/deleteUserCommand/deleteUserHandler");

const GetAuthenticatedUserHandler = require("../../core/services/features/user/queries/getAuthenticatedUserQuery/getAuthenticatedUserHandler");
const GetUserByIdHandler = require("../../core/services/features/user/queries/getUserByIdQuery/getUserByIdHandler");
const GetUserByUsernameHandler = require("../../core/services/features/user/queries/getUserByUsernameQuery/getUserByUsernameHandler");
const GetAllUsersHandler = require("../../core/services/features/user/queries/getAllUsersQuery/getAllUsersHandler");

module.exports = ({ authService, tokenBlacklist }) => {
    const router = express.Router();

    const userRepository = new UserRepository();

    const createUserHandler = new CreateUserHandler(userRepository);
    const updateUserHandler = new UpdateUserHandler(userRepository);
    const deleteUserHandler = new DeleteUserHandler(userRepository);
    const getAuthenticatedUserHandler = new GetAuthenticatedUserHandler(userRepository);
    const getUserByIdHandler = new GetUserByIdHandler(userRepository);
    const getUserByUsernameHandler = new GetUserByUsernameHandler(userRepository);
    const getAllUsersHandler = new GetAllUsersHandler(userRepository);

    const userController = new UserController(
        createUserHandler,
        updateUserHandler,
        deleteUserHandler,
        getAuthenticatedUserHandler,
        getUserByIdHandler,
        getUserByUsernameHandler,
        getAllUsersHandler
    );

    // Ruta original que requiere autenticación y permisos
    router.post('/auth/register', authMiddleware(authService, tokenBlacklist), requirePermission(PERMISSIONS.CAN_CREATE_USERS), validateUserRegister, (req, res) => userController.registerUser(req, res));
    
    // Nueva ruta temporal para crear un usuario de prueba sin autenticación
    router.post('/auth/register-test-user', validateUserRegister, (req, res) => userController.registerUser(req, res));

    router.delete('/user/:id', authMiddleware(authService, tokenBlacklist), requirePermission(PERMISSIONS.CAN_DELETE_USERS), validateUserDelete, (req, res) => userController.deleteUser(req, res));

    router.get('/auth/me', authMiddleware(authService, tokenBlacklist), (req, res) => userController.getAuthenticatedUser(req, res));

    router.get('/users', authMiddleware(authService, tokenBlacklist), requirePermission(PERMISSIONS.CAN_VIEW_USERS), (req, res) => userController.getAllUsers(req, res));

    router.get('/user/:id', authMiddleware(authService, tokenBlacklist), requirePermission(PERMISSIONS.CAN_VIEW_USERS), validateGetUserId, (req, res) => userController.getUserById(req, res));

    router.get('/user/username/:username', authMiddleware(authService, tokenBlacklist), requirePermission(PERMISSIONS.CAN_VIEW_USERS), validateGetUserUsername, (req, res) => userController.getUserByUsername(req, res));

    router.put('/user/:id', authMiddleware(authService, tokenBlacklist), requirePermission(PERMISSIONS.CAN_UPDATE_USERS), validateUserUpdate, (req, res) => userController.updateUser(req, res));

    return router;
};
