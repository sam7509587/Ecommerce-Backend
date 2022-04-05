
const { valid, validUserProfile } = require('../validations');
const { USER,ApiError } = require('../config');
const { createUser, userLogin, updateBody } = require('../services');
const {
  userPresent,
  verifyEmail,
  sendMail,
  UserData,
  verifyToken,
} = require('../utlilities');
const { validSeller } = require('../validations');

exports.registerUser = async (req, res, next) => {
  const validData = await validSeller(req);
  if (validData.error)
  return next(new ApiError(422, validData.error.details[0].message))
  const emailId = verifyEmail(req);
  if (emailId == false) {
    return next(new ApiError(404, 'invalid Email :- try gmail or yopmail for registration'))
  }
  const user = await userPresent(req);
      if (user) {
        return next(new ApiError(409, 'email or phone already registered'))
      }
          const data = UserData(req);
          const newUser = await createUser(data, res);
          const token = newUser.resetToken;
          sendMail(req, token, 'token is here and will expire in 10 min', USER);
          res.status(200).json({
            status: 200,
            message:
              'Sign Up Successfull mail sent and token is here and will expire in 10 min',
            success: true,
          });
      
};
const emailLogUser = async (req, res) => {
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
      if (userAvailable.role === USER) {
        await userLogin(req, res, userAvailable);
      } else {
        res.status(401).json({
          status: 401,
          message: 'only user can login from here',
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
    if (userAvailable.role === USER) {
      await userLogin(req, res, userAvailable);
    } else {
      res.status(401).json({
        status: 401,
        message: 'only user can login from here',
        success: false,
      });
    }
  }
};
exports.loginUser = async (req, res, next) => {
  const validUser = await valid(req);
  if (validUser === 'noError') {
    if (req.body.email) {
      emailLogUser(req, res);
    } else {
      phoneLog(req, res);
    }
  } else {
    res.status(403).json({ status: 403, message: validUser, success: false });
  }
};


exports.editUser =async(req,res,next)=>{
  const id =req.user._id
  const validProfile = validUserProfile(req)
  if(validProfile.error){
    return next(new ApiError(401,validProfile.error.details[0].message))
  }
  const data = await updateBody(req,id)
  return res.status(201).json({stattus :201,message: "data has been updated",data,success: true})
}
