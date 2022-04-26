const { ApiError,USER } = require('../config');
const { User } = require('../models');
const { createUser, updateSellerBody } = require('../services');
const {
  userPresent,
  sendMail,
  verifyEmail,
  sellerData,
  verifyToken,
} = require('../utlilities');

exports.registerSelller = async (req, res, next) => {
  const seller = await userPresent(req);
  if (seller) {
   return next(new ApiError(409, 'email or phone already registered'))
  }
  const data = sellerData(req);
  const newUser = await createUser(data, res);
  const token = newUser.resetToken;
  req.fullName =newUser.fullName
  sendMail(req, token, 'token is here and will expire in 10 min');
  return res.status(201).json({
    statusCode: 201,
    message:
      'Sign Up Successfull mail sent and token is here and will expire in 10 min',
      data:newUser
  });
};
exports.editSellerProfile=async(req,res,next)=>{
  try{
  const id = req.user.id;
  if(Object.entries(req.body).length ===0){
    return next(new ApiError(404,"nothing to change"))
  }
  if(req.body.email){
   return next(new ApiError(409,"cant change email"))
  }
  const data = await updateSellerBody(req,id)
  const updated = await User.findOne({_id:id})
  return res.status(201).json({statusCode :201,message: "data has been updated",data:updated})
}catch(err){
  if (err.name === "CastError") {
    return next(new ApiError(409, "check all ids may be format is wrong"))
  }
  return next(new ApiError(409, `err  : ${err}`))
}
}
exports.deleteSeller=(req,res,next)=>{
  if( req.user.isDeleted=true){
    return next(new ApiError(409,"no user found may the user has deleted the account"))
  }
  req.user.isDeleted=true;
  req.user.save();
  return res.status(200).json({
    statusCode:200,
    message: "data has been deleted"
  })
}
