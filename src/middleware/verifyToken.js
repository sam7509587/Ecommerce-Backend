const jwt  = require("jsonwebtoken");
const { ApiError, SECRET_KEY } = require("../config");
const { User } = require("../models");
exports.tokenVerify = async (req,res,next) => {
    try {
      if(req.headers.authorization){

        if (req.headers.authorization === undefined) {
          return next(new ApiError(404,"no token found"))
      }
        const token = req.headers.authorization.split(' ')[1];
        const user = await jwt.verify(token, SECRET_KEY, async (err, info) => {
          if (info) {
            const user = await User.findOne({ _id: info.uad });
            if(!user){
              return next(new ApiError(404, "no user found attached to this token"))
            }
            req.role = user.role
            req.user=user
            next()
          } else {
            return next(new ApiError(401,"unauthorised user"))
          }
        });
        return user;
      
    }}
catch (err) {
  
      return err;
    }
  };
  