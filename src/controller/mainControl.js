const { ApiError, S1 } = require('../config');
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
      if (userAvailable.role === S1) {
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
    if (userAvailable.role === S1) {
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
  const validUser = await valid(req);
  if (validUser === 'noError') {
    if (req.body.email) {
      emailLog(req, res);
    } else {
      phoneLog(req, res);
    }
  } else {
    res.status(403).json({ status: 403, message: validUser, success: false });
  }
};
