const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware to check express-validator results
 * Place after validation chain in route definition
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      'Validation failed. Please check your input.',
      422,
      errors.array().map((err) => ({ field: err.path, message: err.msg }))
    );
  }
  next();
};

module.exports = validate;
