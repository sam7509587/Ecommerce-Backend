const { logger } = require('../shared');
const ApiError = require('./apierror');

exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.code).json({
      success: false,
      status: err.code,
      message: err.msg,
      
    });
    return;
  }
  res.status(500).json({ status: 500, message: err.message, success: false });
};
exports.environment = (key) => {
  if (process.env[key] === undefined) {
    logger.error('env vaivaiable in undefined....');
    process.exit();
  } else {
    return process.env[key];
  }
};
