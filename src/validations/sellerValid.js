const async = require('hbs/lib/async');
const joi = require('joi');

exports.validSeller = async (req) => {
  
  const data = joi.object({
    password: joi.string().required().min(2).max(30),
    email: joi.string().email().lowercase().trim().required(),
    phoneNumber: joi
      .string()
      .required()
      .regex(/^[789]\d{9}$/)
      .message('invalid phone numbeer please check '),
    fullName: joi.string().lowercase().trim().max(30).min(6).required(),
  });
  const validData = await data.validate(req.body);
  return validData
};
exports.ValidSellerProfile=async(req)=>{
    const data = joi.object({
      gstNumber : joi.string(),
      document:joi.string()
      .when('gstNumber', {is: joi.exist(), then: joi.required(), otherwise: joi.optional()}),
      fullName: joi.string().lowercase().trim().max(30).min(6),
      phoneNumber: joi
      .string()
      .regex(/^[789]\d{9}$/)
      .message('invalid phone numbeer please check '),
    })
    const validData = await data.validate(req.body);  
    return validData
    
}
