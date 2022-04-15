const { ApiError, SELLER } = require('../config');
const { valid } = require('../validations');
const { createUser, userLogin, userPhoneLogin } = require('../services');
const {
  sendOtp,
  sendMail,
  userPresent,
  generateOtp,
  verifyEmail,
} = require('../utlilities');

const emailLog = async (req, res) => {
  const emailId = verifyEmail(req);
  if (emailId === true) {
    const userAvailable = await userPresent(req);
    if (userAvailable == null || userAvailable.password != req.body.password) {
      res.status(401).json({
        status: 401,
        message: 'invalid email or password',
        success: false,
      });
    } else {
      if (userAvailable.role === SELLER) {
        req.body.fullName= userAvailable.fullName
        await userLogin(req, res, userAvailable);
      } else {
        res.status(401).json({
          status: 401,
          message: 'only seller can login from here',
          success: false,
        });
      }
    }
  } else {
    res.status(422).json({
      status: 422,
      message: 'invalid Email :- try gmail or yopmail for login',
    });
  }
};
const phoneLog = async (req, res) => {
  const userAvailable = await userPresent(req);
  if (userAvailable == null || userAvailable.password != req.body.password) {
    res.status(401).json({
      status: 401,
      message: 'invalid email or password',
      success: false,
    });
  } else {
    if (userAvailable.role === SELLER) {
      await userLogin(req, res, userAvailable);
    } else {
      res.status(401).json({
        status: 401,
        message: 'only seller can login from here',
        success: false,
      });
    }
  }
};
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
