const { User, category, brand } = require('../models');
const { validAdmin, validSeller } = require('../validations');
const { createUser } = require('../services');
const {
  userPresent,
  sendMail,
  adminData,
  fieldsToShow,
  sortByField,
} = require('../utlilities');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, ADMIN, SELLER, ApiError } = require('../config/index');
const async = require('hbs/lib/async');

exports.showSeller = async (req, res) => {
  var { page = 1, limit = 5 } = req.query;
  const fields = fieldsToShow(req);
  //    const sort = sortByField(req)
  const sellers = await User.find({ role: SELLER }, fields)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
    
  res.status(200).json({
    status: 200,
    mesage: ` total data found : ${sellers.length}`,
    sellers,
    success: true,
  });

};
exports.approveSeller = async (req, res,next) => {
  try {
    const _id = req.body.sellerId || req.query.id;
    const user = await User.findOne({ _id });
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
    res.status(200).json({
      status: 200,
      message:
        'the user has been approved and now can login - mail has been sent',
    });

  } catch (err) {
    if (err.name === 'CastError') {
      res.status(403).json({
        status: 403,
        message: 'invalid id format',
        success: false,
      });
    } else {
      next(new ApiError(500,err))
    }
  }
};

exports.loginAdmin = async (req, res, next) => {
  const adminPresent = await User.findOne({ role: ADMIN });
  if (adminPresent === null) {
    const validUser = await validAdmin(req);
    if (validUser.error) {
      return next(ApiError.Forbidden(validUser));
    }
      const userAvailable = await userPresent(req);
      if (userAvailable === null) {
        const adminInfo = adminData(req);
        const newUser = await createUser(adminInfo, res);
        if (newUser === undefined) {
          res.status(403).json({
            status: 403,
            message:
              'error occured while saving data -may be role type is invalid',
            success: false,
          });
        } else {
          await this.enterAdmin(req, res);
        }
      } else {
        return next(new ApiError(404, 'email not available try another email'))
      }    
  } else {
    await this.enterAdmin(req, res, next);
  }
};

exports.enterAdmin = async (req, res, next) => {
  const userAvailable = await userPresent(req);
  const admin = userAvailable;
  if (
    admin != null &&
    admin.password === req.body.password &&
    admin.role === ADMIN
  ) {
    const payload = {
      uad: admin._id,
    };
    refreshToken = jwt.sign(payload, SECRET_KEY);
    accessToken = jwt.sign(payload, SECRET_KEY);
    res.status(200).json({
      status: 200,
      accessToken,
      message: 'log in successfull',
    });
  } else {
    return next(ApiError.Unauthorised('invalid email or password'));
  }
};

exports.addCategory = async (req, res, next) => {
  const categoryName = req.body.categoryName;
  if (!categoryName)
    return next(new ApiError(404, "categoryName is required"))
  const namePresent = await category.findOne({ categoryName: categoryName })
  if (namePresent) {
    return next(new ApiError(409, "categoryName already present"))
  }
  const data= await category.create({ categoryName: categoryName })
  res.status(201).json({
    status: 201,
    message: "category has been added",
    data,
    success: false
  })
}
exports.addBrand = async (req, res, next) => {
  const brandName = req.body.brandName;
  if (!brandName)
    return next(new ApiError(404, "brandName is required"))
  const namePresent = await brand.findOne({brandName :brandName})
  if (namePresent) {
    return next(new ApiError(409, "brand name already present"))
  }
  else{
  data  = await brand.create({brandName :brandName})
  res.status(201).json({
    status: 201,
    message: "brand has been added",
    data,
    success: false
  })}
}
