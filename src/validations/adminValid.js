const joi = require('joi');
const { ApiError } = require('../config');

exports.validAdmin = async (req,res,next) => {
  const data = joi.object({
    name: joi.string().trim(),
    email: joi.string().email().trim().required(),
    address: joi.string().trim(),
    isActive: joi.boolean(),
    password: joi.string().required().trim(),
    profileImg: joi.string().trim(),
    isVerified: joi.boolean(),
    resetToken: joi.string().trim(),
  });
  const validData = await data.validate(req.body);
  if (validData.error) {
    const err = validData.error.details[0].message.replace(/[^a-zA-Z ]/g, "")
    return next(new ApiError(409, err))
  }
  else {
    next()
  }
};
