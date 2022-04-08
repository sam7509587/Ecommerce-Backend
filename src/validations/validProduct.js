
const joi = require('joi');
const { ApiError } = require('../config');

exports.validProduct = async (req,res,next) => {
  const data = joi.object({
    productName	:joi.string().lowercase().required().min(2).max(15).trim(),
    categoryId	:joi.string().required().lowercase().trim(),
    brandId: joi.string().lowercase().required().trim(),
    price	:joi.number().required().trim(),
    isAvailable	:joi.boolean,
    rating	:joi.number(),
    quantity:joi.number().trim(),
    publicId:joi.string().lowercase().trim(),
    description	:joi.string().lowercase().min(5).max(150).trim(),
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
    productName	:joi.string().lowercase().min(2).max(15).trim(),
    categoryId	:joi.string().lowercase().trim(),
    brandId: joi.string().lowercase().trim(),
    price	:joi.number().trim(),
    isAvailable	:joi.boolean.trim(),
    quantity:joi.number().trim(),
    description	:joi.string().lowercase().max(150).min(5).trim(),
  })
  const validData = await data.validate(req.body);
  if(validData.error){
    next(new ApiError(400,validData.error.details[0].message))
  }else{
    next()
  }
  return validData
}

exports.validBrand = async(req,res,next)=>{
  const data = joi.object({
    brandName	:joi.string().lowercase().min(2).max(15).trim(),
    description	:joi.string().lowercase().max(150).min(5).trim(),
  })
  const validData = await data.validate(req.body);
  if(validData.error){
    next(new ApiError(400,validData.error.details[0].message))
  }else{
    next()
  }
  return validData
}

exports.validCategory = async(req,res,next)=>{
  const data = joi.object({
    categoryName	:joi.string().lowercase().min(2).max(15).trim(),
    description	:joi.string().lowercase().max(150).min(5).trim(),
  })
  const validData = await data.validate(req.body);
  if(validData.error){
    next(new ApiError(400,validData.error.details[0].message))
  }else{
    next()
  }
  return validData
}
