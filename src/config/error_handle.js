
const { logger } = require('../shared');
const ApiError = require('./apierror');

exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.code).json({
      statusCode: err.code,
      message: err.msg,
    });
    return;
  }
  return res.status(500).json({ statusCode: 500, message: err.message});
};
exports.environment = (key) => {
  if (process.env[key] === undefined) {
    logger.error('env vaivaiable in undefined....');
    process.exit();
  } else {
    return process.env[key];
  }
};
