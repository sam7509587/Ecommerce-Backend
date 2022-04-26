
const { USER, ApiError } = require('../config');
const { createUser, userLogin, updateBody } = require('../services');
const {
  userPresent,
  sendMail,
  UserData,
} = require('../utlilities');

exports.registerUser = async (req, res, next) => {
  const user = await userPresent(req);
  if (user) {
    return next(new ApiError(409, 'email or phone already registered'))
  }
  const data =await UserData(req);
  const newUser = await createUser(data);
  const token = newUser.resetToken;
  await sendMail(req, token, 'token is sent will expire in 10 min', USER);
  return res.status(201).json({
    statusCode: 201,
    message:
      'Sign Up Successfull mail sent and token is here and will expire in 10 min',
      data: newUser
  });


};
exports.loginUser = async (req, res, next) => {
  const userAvailable = await userPresent(req);
  if(!userAvailable){
    return next(new ApiError(400,"no user found"))
  }
  if (userAvailable.role != USER) {
    return next(new ApiError(401, 'only user con login from here'))
  }
  if (!userAvailable || userAvailable.password != req.body.password) {
    return next(new ApiError(403, 'invalid email or password'))
  }
  await userLogin(req, res, userAvailable);
};


exports.editUser = async (req, res, next) => {
  const id = req.user._id
  if(req.body.email){
    return next(new ApiError(409,"cant change email"))
   }
  const data = await updateBody(req, id)
  return res.status(201).json({ statusCode: 201, message: "data has been updated", data })
}
exports.deleteUser=(req,res,next)=>{
  if(req.user.isDeleted===true){
    return next(new ApiError(409,"no user fonund or user has deleted the account"))
  }
  req.user.isDeleted=true;
  req.user.save();
  return res.status(200).json({
    statusCode:200,
    message: "data has been deleted"
  })
}
