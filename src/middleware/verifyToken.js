const jwt = require("jsonwebtoken");
const { ApiError, SECRET_KEY } = require("../config");
const { User } = require("../models");
exports.tokenVerify = async (req, res, next) => {
  try {
    let token;
    if(req.headers.authorization){
      token = req.headers.authorization.split(' ')[1] 
    }
    else if (req.cookies.access_token) {
      token = req.cookies.access_token;
      // return next(new ApiError(404, "no token found"))
    }
    else{
      return next(new ApiError(404, "no token found")) 
    }
      const user = await jwt.verify(token, SECRET_KEY, async (err, info) => {
        if (info) {
          const user = await User.findOne({ _id: info.uad });
          if (!user) {
            return next(new ApiError(404, "no user found attached to this token"))
          }
          req.user = user
          next()
        } else {
          return next(new ApiError(401, "unauthorised user"))
        }
      });
      return user;
  }
  catch (err) {
    next(new ApiError(400,err.message))
  }
};
