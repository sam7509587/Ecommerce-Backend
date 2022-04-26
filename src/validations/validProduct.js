
const joi = require('joi');
const { ApiError } = require('../config');

exports.validProduct = async (req,res,next) => {
  const validPayments = req.body.paymentMode?.split(",")
  req.body.paymentMode = validPayments
  const data = joi.object({
    productName	:joi.string().lowercase().required().min(2).max(15).trim(),
    categoryId	:joi.string().required().lowercase().trim().hex().length(24).message("invalid categoryId format"),
    brandId: joi.string().lowercase().required().trim().hex().length(24).message("invalid categoryId format"),
    price	:joi.number().required(),
    quantity:joi.number().required(),
    paymentMode: joi.array().items(joi.string().valid("COD").valid("NB").valid("UPI")).required(),
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
    categoryId	:joi.string().lowercase().trim().hex().length(24).message("invalid categoryId format"),
    brandId: joi.string().lowercase().trim().hex().length(24).message("invalid categoryId format"),
    price	:joi.number(),
    quantity:joi.number(),
    paymentMode: joi.array().items(joi.string().valid("COD").valid("NB").valid("UPI")),
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
  if (validData.error) {
    const errorMsg =validData.error.details[0].message.replace(/[^a-zA-Z ]/g, "")
    return next(new ApiError(409,errorMsg))
  } else {
    next()
  }}

exports.validCategory = async(req,res,next)=>{
  const data = joi.object({
    categoryName	:joi.string().lowercase().min(2).max(15).trim(),
    description	:joi.string().lowercase().max(150).min(5).trim(),
  })
  const validData = await data.validate(req.body);
  if (validData.error) {
    const errorMsg =validData.error.details[0].message.replace(/[^a-zA-Z ]/g, "")
    return next(new ApiError(409,errorMsg))
  } else {
    next()
  }
}
