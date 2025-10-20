const { PERMISSIONS } = require('../../../config/permissions');

const requirePermission = (permission) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ 
                message: 'No autenticado',
                error: 'AUTHENTICATION_REQUIRED'
            });
        }

        if (!user.permissions || !Array.isArray(user.permissions)) {
            return res.status(403).json({ 
                message: 'Usuario sin permisos asignados',
                error: 'NO_PERMISSIONS'
            });
        }

        if (!user.permissions.includes(permission)) {
            return res.status(403).json({ 
                message: `Permiso requerido: ${permission}`,
                error: 'INSUFFICIENT_PERMISSIONS',
                required: permission,
                userPermissions: user.permissions
            });
        }

        next();
    };
};

module.exports = requirePermission;
module.exports.PERMISSIONS = PERMISSIONS;
