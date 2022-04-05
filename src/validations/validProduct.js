
const joi = require('joi');

exports.validProduct = async (req) => {
  const data = joi.object({
    productName	:joi.string().lowercase().required(),
    category	:joi.string().required().lowercase(),
    brand: joi.string().lowercase().required(),
    price	:joi.number().required(),
    image:	joi.string(),
    isAvailable	:joi.boolean,
    rating	:joi.number(),
    quantity:joi.string(),
    publicId:joi.string().lowercase(),
    description	:joi.string().lowercase(),
  })
  let validateData ;
  if(req.data){ validateData = req.data}
  validateData = req.body
  const validData = await data.validate(validateData);
  return validData
}
exports.validEntry = async(req)=>{
  const data = joi.object({
    productName	:joi.string().lowercase(),
    category	:joi.string().lowercase(),
    brand: joi.string().lowercase(),
    price	:joi.number(),
    image:	joi.string(),
    isAvailable	:joi.boolean,
    rating	:joi.number(),
    quantity:joi.string(),
    description	:joi.string().lowercase(),
    publicId:joi.string().lowercase(),
    productId:joi.string().lowercase().required()
  })
  let validateData ;
  if(req.data){ validateData = req.data}
  validateData = req.body
  const validData = await data.validate(validateData);
  return validData
}
