const VerifyTokenCommand = require('../../../core/services/features/auth/command/verifyToken/verifyTokenCommand');
const VerifyTokenHandler = require('../../../core/services/features/auth/command/verifyToken/verifyTokenHandler');
const logger = require('../../../core/utils/logger');

const authMiddleware = (authService, tokenBlacklist) => {
    const verifyTokenHandler = new VerifyTokenHandler(authService);

    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ message: 'Authorization header missing or malformed' });
        }

        const token = authHeader.split(' ')[1];
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ message: 'Token has been revoked' });
        }

        try {
            const query = new VerifyTokenCommand(token);
            const decodedToken = await verifyTokenHandler.handle(query);
            req.user = decodedToken;
            next();
        } catch (error) {
            logger.error('Error en middleware de autenticación', { error });
            return res.status(401).json({ message: 'Invalid token or token expired' });
        }
    };
};

module.exports = { authMiddleware };

