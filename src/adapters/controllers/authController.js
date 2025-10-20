const AuthenticateUserCommand = require('../../core/services/features/auth/command/authenticateUser/authenticateUserCommand');
const LogoutUserCommand = require('../../core/services/features/auth/command/logoutUser/logoutUserCommand');
const VerifyTokenCommand = require('../../core/services/features/auth/command/verifyToken/verifyTokenCommand');
const RefreshTokenCommand = require('../../core/services/features/auth/command/refreshToken/refreshTokenCommand');
const logger = require('../../core/utils/logger');
const jwt = require('jsonwebtoken');

class AuthController {
    constructor(authenticateUserHandler, logoutUserHandler, verifyTokenHandler, refreshTokenHandler) {
        this.authenticateUserHandler = authenticateUserHandler;
        this.logoutUserHandler = logoutUserHandler;
        this.verifyTokenHandler = verifyTokenHandler;
        this.refreshTokenHandler = refreshTokenHandler;
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: 'Username y password son requeridos' });
            }

            const command = new AuthenticateUserCommand(username, password);
            const { userClient, token } = await this.authenticateUserHandler.handle(command);

            // Generar refresh token
            const refreshToken = jwt.sign(
                { id: userClient.id, username: userClient.username },
                process.env.REFRESH_SECRET || process.env.JWT_SECRET || 'dev-secret',
                { expiresIn: process.env.REFRESH_EXPIRES_IN || '7d' }
            );

            return res.status(200).json({
                message: 'Login exitoso',
                user: userClient,
                token,
                refreshToken
            });
        } catch (error) {
            logger.error('Error en login', { error: error.message });

            return res.status(401).json({
                message: 'Credenciales inválidas o error de autenticación',
                error: error.message
            });
        }
    }

    async logout(req, res) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(400).json({ message: 'Token no proporcionado o mal formado' });
            }

            const token = authHeader.split(' ')[1];
            const command = new LogoutUserCommand(token);
            const result = await this.logoutUserHandler.handle(command);

            return res.status(200).json({
                message: 'Logout exitoso',
                result
            });
        } catch (error) {
            logger.error('Error en logout', { error: error.message });

            return res.status(500).json({
                message: 'Error al cerrar sesión',
                error: error.message
            });
        }
    }

    async verifyToken(req, res) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ message: 'Token requerido' });
            }

            const command = new VerifyTokenCommand(token);
            const isValid = await this.verifyTokenHandler.handle(command);

            return res.status(200).json({
                valid: isValid
            });
        } catch (error) {
            logger.error('Error al verificar token', { error: error.message });

            return res.status(500).json({
                message: 'Error al verificar el token',
                error: error.message
            });
        }
    }

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({ message: 'Refresh token requerido' });
            }

            // Validar refresh token
            let decoded;
            try {
                decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || process.env.JWT_SECRET || 'dev-secret');
            } catch (e) {
                return res.status(401).json({ message: 'Refresh token inválido o expirado' });
            }

            // Emitir nuevo access token con info básica
            const newToken = jwt.sign(
                { id: decoded.id, username: decoded.username },
                process.env.JWT_SECRET || 'dev-secret',
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );

            return res.status(200).json({
                message: 'Token refrescado exitosamente',
                token: newToken
            });
        } catch (error) {
            logger.error('Error al refrescar token', { error: error.message });

            return res.status(500).json({
                message: 'Error al refrescar el token',
                error: error.message
            });
        }
    }
}

module.exports = AuthController;
