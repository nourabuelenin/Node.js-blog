const APIError = require("./../util/APIError");

const restrictTo = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      throw new APIError("You are not authorized to access this resource", 403);
    }
    next();
  };
};

module.exports = restrictTo;
