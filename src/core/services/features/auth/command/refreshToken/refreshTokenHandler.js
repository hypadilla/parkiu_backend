const jwt = require('jsonwebtoken');
const config = require('../../../../../../config/auth');
class RefreshTokenHandler {
    async handle(command) {
        try {
            const decoded = jwt.verify(command.refreshToken, config.refreshSecretKey);

            const payload = { userId: decoded.userId, username: decoded.username };

            const newToken = jwt.sign(payload, config.secretKey, {
                expiresIn: config.tokenExpiresIn || '1h'
            });

            return newToken;
        } catch (error) {
            throw new Error('Refresh token inválido o expirado');
        }
    }
}

module.exports =  RefreshTokenHandler;
