const { ApiError, SELLER } = require('../config');
const {  userLogin } = require('../services');
const {
  userPresent,
} = require('../utlilities');

exports.login = async (req, res, next) => {
  const userAvailable = await userPresent(req);
  if (userAvailable.role != SELLER) {
    return next(new ApiError(401, 'only user con seller from here'))
  }
  if (!userAvailable || userAvailable.password != req.body.password) {
    return next(new ApiError(403, 'invalid email or password'))
  }
  await userLogin(req, res, userAvailable);
};
