// Middleware to check user roles and permissions
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (userRole !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};

module.exports = roleMiddleware;