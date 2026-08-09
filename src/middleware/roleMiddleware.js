const { errorResponse } = require('../utils/apiResponse');

/**
 * Restrict access to specific roles
 * Usage: authorize('admin') or authorize('admin', 'moderator')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Role '${req.user.role}' is not authorized for this action.`,
        403
      );
    }

    next();
  };
};

module.exports = { authorize };
