const async = require('hbs/lib/async');
const joi = require('joi');
const { ApiError } = require('../config');

exports.validSeller = async (req, res, next) => {

  const data = joi.object({
    password: joi.string().required().min(6).max(30),
    email: joi.string().email().lowercase().trim().required().regex(/.*\yopmail.com/).message("email must ends with @gmail.com or @yopmail.com"),
    phoneNumber: joi
      .string()
      .required()
      .regex(/^[789]\d{9}$/)
      .message('invalid phone numbeer please check '),
    fullName: joi.string().lowercase().trim().max(30).min(3).required(),
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
exports.ValidSellerProfile = async (req,res,next) => {
  const data = joi.object({
    gstNumber: joi.string(),
    document: joi.string()
      .when('gstNumber', { is: joi.exist(), then: joi.required(), otherwise: joi.optional() }),
    fullName: joi.string().lowercase().trim().max(30).min(6),
    phoneNumber: joi
      .string()
      .regex(/^[789]\d{9}$/)
      .message('invalid phone numbeer please check '),
  })
  const validData = await data.validate(req.body);
  if (validData.error) {
    const err = validData.error.details[0].message.replace(/[^a-zA-Z ]/g, "")
    return next(new ApiError(409, err))
  }
  else {
    next()
  }

}
