
const { logger } = require('../shared');
const ApiError = require('./apierror');

exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    const {name}=err.msg
    if(name ==="CastError"){
      return res.status(409).json({
        statusCode: 409,
        message: "invalid id"
      });
    }
    return res.status(err.code).json({
      statusCode: err.code,
      message: err.msg,
    });
  }else{
    return res.status(500).json({ statusCode: 500, message: err.message});
  }
};
exports.environment = (key) => {
  if (process.env[key] === undefined) {
    logger.error('env vaivaiable in undefined....');
    process.exit();
  } else {
    return process.env[key];
  }
};
