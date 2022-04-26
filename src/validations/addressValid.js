const joi = require('joi');
const { ApiError } = require('../config');

exports.validAddress = async (req,res,next) => {
  const data = joi.object({
    country: joi.string().min(2).max(30).trim().required(),
    state: joi.string().min(2).max(30).trim().required(),
    city: joi.string().lowercase().trim().required(),
    street: joi.string().trim().required(),
    houseNo: joi.string().trim().required(),
    pinCode: joi.number().required(),
    landMark: joi.string().lowercase().required(),
    addressType: joi.string().lowercase().required().valid("home","bussiness","office")
  });
  const validData = await data.validate(req.body);
  if (validData.error) {
    const errorMsg =validData.error.details[0].message.replace(/[^a-zA-Z ]/g, "")
    return next(new ApiError(409,errorMsg))
  } else {
    next()
  }
};
exports.validAddEdit= async (req,res,next) => {
  const data = joi.object({
    country: joi.string().min(2).max(30).trim(),
    state: joi.string().min(2).max(30).trim(),
    city: joi.string().lowercase().trim(),
    street: joi.string().trim(),
    houseNo: joi.string().trim(),
    pinCode: joi.number(),
    landMark: joi.string().lowercase(),
    addressType: joi.string().lowercase().valid("home","bussiness"),
    isDefault: joi.boolean(),
  });
  const validData = await data.validate(req.body);
  if (validData.error) {
    const errorMsg =validData.error.details[0].message.replace(/[^a-zA-Z ]/g, "")
    return next(new ApiError(409,errorMsg))
  } else {
    next()
  }
};
