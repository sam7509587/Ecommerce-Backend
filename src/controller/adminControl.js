const { User } = require('../models');
const {
  userPresent,
  sendMail,
  fieldsToShow,
  searchValues,
} = require('../utlilities');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, ADMIN, SELLER, ApiError } = require('../config/index');
const objectId = require("mongoose").Types.ObjectId;

exports.showSeller = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const fields = fieldsToShow(req);
  const search = searchValues(req);
  const sellers = await User.find(Object.assign({role:{$ne:ADMIN}},search), fields)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 }).populate("address");
    
  return res.status(200).json({
    statusCode: 200,
    mesage: ` data found`,
   data: sellers,
  });

};
exports.approveSeller = async (req, res,next) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id ,role: SELLER});
    if (!user) {
      return next(new ApiError(404, "no seller found"))
    }
    if (user.isApproved === true) {
      await User.updateOne({ _id }, { isApproved: false });
      next(new ApiError(409, "already approved"))
    }
    await User.updateOne({ _id }, { isApproved: true });
    req.body.email = user.email;
    req.body.fullName = user.fullName;
    const token = undefined;
    await sendMail(
      req,
      token,
      'you are approved by admin and now you can login !! '
    );
    return res.status(200).json({
      statusCode: 200,
      message:
        'the user has been approved and now can login - mail has been sent',
    });

  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(403).json({
        statusCode: 403,
        message: 'invalid id format',
      });
    } else {
      next(new ApiError(500,err))
    }
  }
};

exports.loginAdmin = async (req, res, next) => {
  const adminPresent = await User.findOne({ role: ADMIN });
  if(adminPresent){
this.enterAdmin(req,res,next)
  }else{
    req.body.role = ADMIN
   const adminCreated =await User.create(req.body);
   this.enterAdmin(req,res,next)
  }
};

exports.enterAdmin = async (req, res, next) => {
  const userAvailable = await userPresent(req);
  const admin = await User.findOne({role:ADMIN,email:req.body.email})
  if (
    admin != null &&
    admin.password === req.body.password
  ) {
    const payload = {
      uad: admin._id,
    };
    accessToken = jwt.sign(payload, SECRET_KEY);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
    }).status(200).json({
      statusCode: 200,
      message: 'log in successfull',
     token: accessToken,
    });
  } else {
    return next(ApiError.Unauthorised('invalid email or password'));
  }
};
exports.deleteUserParmanently=async(req,res,next)=>{
  const user = await User.findOne({_id:req.params.id,role:{$ne:ADMIN}});
  if(!user){
    return next(new ApiError(404,"no user found"));
  }
  user.remove();
  return res.status(200).json({statusCode:200,message:"user deleted successfull"})
}

exports.rejectSeller=async(req,res,next)=>{
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id });
    if (!user) {
      return next(new ApiError(404, "no seller found"))
    }
    if (user.isApproved === false) {
      next(new ApiError(409, "already rejected"))
    }
    await User.updateOne({ _id }, { isApproved: false });
    req.body.email = user.email;
    req.body.fullName = user.fullName;
    const token = undefined;

    await sendMail(
      req,
      token,
      'you are rejected by admin and now you can"t login !! '
    );
    return res.status(200).json({
      statusCode: 200,
      message:
        'the user has been rejected and now can login - mail has been sent',
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(403).json({
        statusCode: 403,
        message: 'invalid id format',
      });
    } else {
      next(new ApiError(500,err))
    }
  }
}
