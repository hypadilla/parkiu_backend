const request = require('supertest');
const AuthController = require('../../../../src/adapters/controllers/authController');
const AuthenticateUserHandler = require('../../../../src/core/services/features/auth/command/authenticateUser/authenticateUserHandler');
const LogoutUserHandler = require('../../../../src/core/services/features/auth/command/logoutUser/logoutUserHandler');
const VerifyTokenHandler = require('../../../../src/core/services/features/auth/command/verifyToken/verifyTokenHandler');
const RefreshTokenHandler = require('../../../../src/core/services/features/auth/command/refreshToken/refreshTokenHandler');
const express = require('express');

jest.mock('../../../../src/core/services/features/auth/command/authenticateUser/authenticateUserHandler');
jest.mock('../../../../src/core/services/features/auth/command/logoutUser/logoutUserHandler');
jest.mock('../../../../src/core/services/features/auth/command/verifyToken/verifyTokenHandler');
jest.mock('../../../../src/core/services/features/auth/command/refreshToken/refreshTokenHandler');

describe('AuthController', () => {
    let app;
    let authController;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        authController = new AuthController(
            new AuthenticateUserHandler(),
            new LogoutUserHandler(),
            new VerifyTokenHandler(),
            new RefreshTokenHandler()
        );

        app.post('/api/auth/login', (req, res) => authController.login(req, res));
        app.post('/api/auth/logout', (req, res) => authController.logout(req, res));
        app.post('/api/auth/verify-token', (req, res) => authController.verifyToken(req, res));
        app.post('/api/auth/refresh-token', (req, res) => authController.refreshToken(req, res));
    });

    describe('POST /api/auth/login', () => {
        it('should return 200 with user and token if credentials are correct', async () => {
            const mockUser = { id: 1, username: 'testuser' };
            const mockToken = 'mockToken123';
            AuthenticateUserHandler.prototype.handle.mockResolvedValue({
                userClient: mockUser,
                token: mockToken
            });

            const response = await request(app).post('/api/auth/login').send({
                username: 'testuser',
                password: 'password123'
            });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login exitoso');
            expect(response.body.user).toEqual(mockUser);
            expect(response.body.token).toBe(mockToken);
        });

        it('should return 400 if username or password is missing', async () => {
            const response = await request(app).post('/api/auth/login').send({
                username: 'testuser'
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username y password son requeridos');
        });

        it('should return 401 if credentials are invalid', async () => {
            AuthenticateUserHandler.prototype.handle.mockRejectedValue(new Error('Credenciales inválidas'));

            const response = await request(app).post('/api/auth/login').send({
                username: 'testuser',
                password: 'wrongpassword'
            });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Credenciales inválidas o error de autenticación');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should return 200 if logout is successful', async () => {
            const mockToken = 'mockToken123';
            LogoutUserHandler.prototype.handle.mockResolvedValue({ success: true });

            const response = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Logout exitoso');
        });

        it('should return 400 if token is missing or malformed', async () => {
            const response = await request(app).post('/api/auth/logout');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Token no proporcionado o mal formado');
        });

        it('should return 500 if an error occurs during logout', async () => {
            const mockToken = 'mockToken123';
            LogoutUserHandler.prototype.handle.mockRejectedValue(new Error('Error en logout'));

            const response = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error al cerrar sesión');
        });
    });

    describe('POST /api/auth/verify-token', () => {
        it('should return 200 with valid: true if token is valid', async () => {
            const mockToken = 'mockToken123';
            VerifyTokenHandler.prototype.handle.mockResolvedValue(true);

            const response = await request(app).post('/api/auth/verify-token').send({ token: mockToken });

            expect(response.status).toBe(200);
            expect(response.body.valid).toBe(true);
        });

        it('should return 400 if token is missing', async () => {
            const response = await request(app).post('/api/auth/verify-token').send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Token requerido');
        });

        it('should return 500 if there is an error verifying the token', async () => {
            const mockToken = 'mockToken123';
            VerifyTokenHandler.prototype.handle.mockRejectedValue(new Error('Error al verificar el token'));

            const response = await request(app).post('/api/auth/verify-token').send({ token: mockToken });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error al verificar el token');
        });
    });

    describe('POST /api/auth/refresh-token', () => {
        it('should return 200 with new token if refresh is successful', async () => {
            const mockRefreshToken = 'mockRefreshToken123';
            const mockNewToken = 'mockNewToken123';
            RefreshTokenHandler.prototype.handle.mockResolvedValue(mockNewToken);

            const response = await request(app).post('/api/auth/refresh-token').send({ refreshToken: mockRefreshToken });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Token refrescado exitosamente');
            expect(response.body.token).toBe(mockNewToken);
        });

        it('should return 400 if refreshToken is missing', async () => {
            const response = await request(app).post('/api/auth/refresh-token').send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Refresh token requerido');
        });

        it('should return 500 if there is an error refreshing the token', async () => {
            const mockRefreshToken = 'mockRefreshToken123';
            RefreshTokenHandler.prototype.handle.mockRejectedValue(new Error('Error al refrescar el token'));

            const response = await request(app).post('/api/auth/refresh-token').send({ refreshToken: mockRefreshToken });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error al refrescar el token');
        });
    });
});
