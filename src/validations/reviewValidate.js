const joi = require('joi');
const { ApiError } = require('../config');

exports.validReview = async (req,res,next) => {
  const data = joi
    .object({
      comment: joi.string().trim().min(5).max(70).required(),
      rating: joi.number().min(1).max(5).required()
    });
  const validData = await data.validate(req.body);
  if (validData.error) {
    const errorMsg =validData.error.details[0].message.replace(/[^a-zA-Z 0-9]/g, "")
    return next(new ApiError(409,errorMsg))
  } else {
    next()
  }
};
exports.validReviewEdit = async (req,res,next) => {
  const data = joi
    .object({
      comment: joi.string().trim().min(5).max(70),
      rating: joi.number().min(1).max(5)
    });
  const validData = await data.validate(req.body);
  if (validData.error) {
    const errorMsg =validData.error.details[0].message.replace(/[^a-zA-Z 0-9 ]/g, "")
    return next(new ApiError(409,errorMsg))
  } else {
    next()
  }
};

