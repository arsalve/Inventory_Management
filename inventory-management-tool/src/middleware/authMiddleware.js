/**
 * Middleware to require a specific role for access.
 * @param {string} role - The required role.
 * @returns {Function} Middleware function.
 */
exports.requireRole = (role) => {
    return (req, res, next) => {
        if (!req.auth || !req.auth.role) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (req.auth.role !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

/**
 * Middleware to require one of multiple roles for access.
 * @param {string[]} roles - The required roles.
 * @returns {Function} Middleware function.
 */
exports.requireRoles = (roles) => {
    return (req, res, next) => {
        if (!req.auth || !req.auth.role) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!roles.includes(req.auth.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};