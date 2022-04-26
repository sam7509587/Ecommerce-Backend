const joi = require('joi');
const { ApiError } = require('../config');

exports.validCartDetails = async (req,res,next) => {
  const data = joi.object({
    products: joi.array().items(joi.object({
      quantity: joi.number().min(1).required(),
      productId:joi.string().hex().length(24).required(),
    })).required(),
  });
  const validData = await data.validate(req.body);
 if(validData.error){
  const errorMsg =validData.error.details[0].message.replace(/[^a-zA-Z 0-9 ]/g,"")
     return next(new ApiError(409,errorMsg))
 }
 else{
     next()
 }
};

exports.validIncrement = async(req,res,next)=>{
  const {value} = req.query;
  if(!value){
  return next(new ApiError(409,"provide value for increment or decrement in query"))
  }
  const data = joi.object({
    value:joi.string().trim().lowercase().valid('increment','decrement')
  })
  const validData = await data.validate(req.query);
  if(validData.error){
      return next(new ApiError(409,validData.error.message))
  }
  else{
      next()
  }
}
