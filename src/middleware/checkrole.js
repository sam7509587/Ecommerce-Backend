const { ApiError } = require("../config");

exports.checkRole =
  (...roles) =>
    (req, _, next) => {
      const { role } = req.user;
      if (!roles.includes(role)) {
        next(new ApiError(403, `only ${roles} can access this route`))
      }
      return next();
    };
