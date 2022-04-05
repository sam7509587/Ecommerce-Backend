const { ApiError,USER } = require('../config');
const { createUser, updateSellerBody } = require('../services');
const {
  userPresent,
  sendMail,
  verifyEmail,
  sellerData,
  verifyToken,
} = require('../utlilities');
const { validSeller ,ValidSellerProfile} = require('../validations');

exports.registerSelller = async (req, res, next) => {
  const validData = await validSeller(req);
  if (validData.error)
  return next(new ApiError(422, validData.error.details[0].message))
  const emailId = verifyEmail(req);
  if (emailId == false) {
    return next(new ApiError(404, 'invalid Email :- try gmail or yopmail for registration'))
  }
  const seller = await userPresent(req);
  if (seller) {
   return next(new ApiError(409, 'email or phone already registered'))
  }
  else{const data = sellerData(req);
  const newUser = await createUser(data, res);
  const token = newUser.resetToken;
  req.fullName =newUser.fullName
  sendMail(req, token, 'token is here and will expire in 10 min');
  return res.status(200).json({
    status: 200,
    message:
      'Sign Up Successfull mail sent and token is here and will expire in 10 min',
    success: true,
  });
}
};
exports.editSellerProfile=async(req,res,next)=>{
  const id = req.user.id;
  if(req.body.email){
   return next(new ApiError(409,"cant change email"))
  }
  const validProfile = await ValidSellerProfile(req)
  if(validProfile.error){
    return next(new ApiError(401,validProfile.error.details[0].message))
  }
  const data = await updateSellerBody(req,id)
  return res.status(201).json({stattus :201,message: "data has been updated",data,success: true})
}

