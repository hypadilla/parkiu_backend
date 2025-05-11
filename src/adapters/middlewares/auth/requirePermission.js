const requirePermission = (permission) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user?.permissions?.includes(permission)) {
            return res.status(user ? 403 : 401).json({ message: user ? 'No permission' : 'Not authenticated' });
        }

        next();
    };
};

module.exports = requirePermission;
