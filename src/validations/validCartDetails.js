const joi = require('joi');
const { ApiError } = require('../config');

exports.validCartDetails = async (req,res,next) => {
  const data = joi.object({
    productId: joi.string().trim(),
    quantity:joi.number()
  });
  const validData = await data.validate(req.body);
 if(validData.error){
     return next(new ApiError(409,validData.error.message))
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
