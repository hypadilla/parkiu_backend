const CreateUserCommand = require('../../core/services/features/user/command/createUserCommand/createUserCommand');
const DeleteUserCommand = require('../../core/services/features/user/command/deleteUserCommand/deleteUserCommand');
const UpdateUserCommand = require('../../core/services/features/user/command/updateUserCommand/updateUserCommand');
const GetAuthenticatedUserQuery = require('../../core/services/features/user/queries/getAuthenticatedUserQuery/getAuthenticatedUserQuery');
const GetUserByIdQuery = require('../../core/services/features/user/queries/getUserByIdQuery/getUserByIdQuery');
const GetUserByUsernameQuery = require('../../core/services/features/user/queries/getUserByUsernameQuery/getUserByUsernameQuery');
const GetAllUsersQuery = require('../../core/services/features/user/queries/getAllUsersQuery/getAllUsersQuery');
const UserAlreadyExistsError = require('../../core/errors/userAlreadyExistsError');
const UserNotFoundError = require('../../core/errors/userNotFoundError');
const logger = require('../../core/utils/logger');

class UserController {
    constructor(
        createUserHandler,
        updateUserHandler,
        deleteUserHandler,
        getAuthenticatedUserHandler,
        getUserByIdHandler,
        getUserByUsernameHandler,
        getAllUsersHandler
    ) {
        this.createUserHandler = createUserHandler;
        this.getAuthenticatedUserHandler = getAuthenticatedUserHandler;
        this.deleteUserHandler = deleteUserHandler;
        this.updateUserHandler = updateUserHandler;
        this.getUserByIdHandler = getUserByIdHandler;
        this.getUserByUsernameHandler = getUserByUsernameHandler;
        this.getAllUsersHandler = getAllUsersHandler;
    }

    async registerUser(req, res) {
        const { id, username } = req.body;

        try {
            const command = new CreateUserCommand(req.body);
            const user = await this.createUserHandler.handle(command);
            logger.info('Usuario creado exitosamente', { userId: id, username });
            res.status(201).json({ message: 'Usuario registrado exitosamente', user });
        } catch (error) {
            logger.error('Error al crear usuario', { error: error.message, userId: id, username });

            if (error instanceof UserAlreadyExistsError) {
                const errorMessage = this.getUserAlreadyExistsMessage(error);
                res.status(400).json({ error: errorMessage });
            } else {
                this.handleUnexpectedError(error, res);
            }
        }
    }

    async getAuthenticatedUser(req, res) {
        try {
            const userId = req.user.id;
            const query = new GetAuthenticatedUserQuery(userId);
            const user = await this.getAuthenticatedUserHandler.handle(query);
            res.status(200).json(user);
        } catch (error) {
            logger.error('Error al obtener el usuario autenticado', { error: error.message, userId: req.user.id });
            res.status(401).json({ message: 'No autorizado' });
        }
    }

    async getAllUsers(req, res) {
        try {
            const pageSize = parseInt(req.query.pageSize) || 10;
            const lastVisible = req.query.lastVisible || null;

            const query = new GetAllUsersQuery(pageSize, lastVisible);
            const result = await this.getAllUsersHandler.handle(query);

            res.status(200).json({
                users: result.users,
                lastVisible: result.lastVisible?.id || null
            });
        } catch (error) {
            logger.error('Error al obtener todos los usuarios', { error: error.message });
            this.handleUnexpectedError(error, res);
        }
    }

    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const query = new GetUserByIdQuery(userId);
            const user = await this.getUserByIdHandler.handle(query);
            res.status(200).json(user);
        } catch (error) {
            logger.error('Error al obtener usuario por ID', { error: error.message, userId: req.params.id });

            if (error instanceof UserNotFoundError) {
                res.status(404).json({
                    error: {
                        message: 'El usuario no fue encontrado',
                        type: 'userNotFound',
                    },
                });
            } else {
                this.handleUnexpectedError(error, res);
            }
        }
    }

    async getUserByUsername(req, res) {
        try {
            const { username } = req.params;
            const query = new GetUserByUsernameQuery(username);
            const user = await this.getUserByUsernameHandler.handle(query);
            res.status(200).json(user);
        } catch (error) {
            logger.error('Error al obtener usuario por username', { error: error.message, username: req.params.username });

            if (error instanceof UserNotFoundError) {
                res.status(404).json({
                    error: {
                        message: 'El usuario no fue encontrado',
                        type: 'userNotFound',
                    },
                });
            } else {
                this.handleUnexpectedError(error, res);
            }
        }
    }

    async updateUser(req, res) {
        const userId = req.params.id;
        const updateData = req.body;

        try {
            const command = new UpdateUserCommand(userId, updateData);
            const updatedUser = await this.updateUserHandler.handle(command);

            logger.info('Usuario actualizado exitosamente', { userId });
            res.status(200).json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
        } catch (error) {
            logger.error('Error al actualizar usuario', { error: error.message, userId });

            if (error instanceof UserNotFoundError) {
                res.status(404).json({
                    error: {
                        message: 'El usuario no fue encontrado',
                        type: 'userNotFound',
                    },
                });
            } else {
                this.handleUnexpectedError(error, res);
            }
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.id;
        try {
            const command = new DeleteUserCommand(userId);
            await this.deleteUserHandler.handle(command);
            logger.info('Usuario eliminado exitosamente', { userId });
            res.status(204).send();
        } catch (error) {
            logger.error('Error al eliminar el usuario', { error: error.message, userId });

            if (error instanceof UserNotFoundError) {
                res.status(404).json({
                    error: {
                        message: 'El usuario no fue encontrado',
                        type: 'userNotFound',
                    },
                });
            } else {
                this.handleUnexpectedError(error, res);
            }
        }
    }

    getUserAlreadyExistsMessage(error) {
        let errorMessage = '';
        let errorType = '';

        if (error.field === 'username') {
            errorMessage = 'El nombre de usuario ya está en uso';
            errorType = 'usernameConflict';
        } else if (error.field === 'email') {
            errorMessage = 'El correo electrónico ya está en uso';
            errorType = 'emailConflict';
        }

        return { message: errorMessage, type: errorType };
    }

    handleUnexpectedError(error, res) {
        const isDev = process.env.NODE_ENV !== 'production';

        logger.error('Error inesperado al procesar la solicitud', {
            error: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            error: {
                message: 'Ocurrió un error al procesar la solicitud',
                type: 'internalServerError',
                ...(isDev && { details: error.message }),
            },
        });
    }
}

module.exports = UserController;
