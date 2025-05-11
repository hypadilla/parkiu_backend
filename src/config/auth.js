module.exports = {
    secretKey: process.env.JWT_SECRET || 'mi_clave_secreta',
    refreshSecretKey: process.env.JWT_REFRESH_SECRET || 'mi_refresh_secreto',
    tokenExpiresIn: '1h',
    refreshTokenExpiresIn: '7d'
};
