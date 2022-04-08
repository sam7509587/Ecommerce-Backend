
const joi = require('joi');
const { ApiError } = require('../config');

exports.validProduct = async (req,res,next) => {
  const data = joi.object({
    productName	:joi.string().lowercase().required().min(2).max(15),
    categoryId	:joi.string().required().lowercase(),
    brandId: joi.string().lowercase().required(),
    price	:joi.number().required(),
    image:	joi.string(),
    isAvailable	:joi.boolean,
    rating	:joi.number(),
    quantity:joi.number(),
    publicId:joi.string().lowercase(),
    description	:joi.string().lowercase().min(5).max(150),
  })
  const validData = await data.validate(req.body);
  if(validData.error){
    return next(new ApiError(400,validData.error.details[0].message))
  }
  else{
    next()
  }
}
exports.validEntry = async(req,res,next)=>{
  const data = joi.object({
    productName	:joi.string().lowercase().min(2).max(15),
    categoryId	:joi.string().lowercase(),
    brandId: joi.string().lowercase(),
    price	:joi.number(),
    image:	joi.string(),
    isAvailable	:joi.boolean,
    rating	:joi.number(),
    quantity:joi.string(),
    description	:joi.string().lowercase().max(150).min(5),
    publicId:joi.string().lowercase(),
  })
  const validData = await data.validate(req.body);
  if(validData.error){
    next(new ApiError(400,validData.error.details[0].message))
  }else{
    next()
  }
  return validData
}
