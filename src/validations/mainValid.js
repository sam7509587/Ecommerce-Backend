const joi = require('joi');
const { NetworkContext } = require('twilio/lib/rest/supersim/v1/network');
const { ApiError } = require('../config');

exports.valid = async (req,res,next) => {
  const data = joi
    .object({
      phoneNumber: joi.string(),
      password: joi.string().required(),
      email: joi.string().email(),
    })
    .xor('email', 'phoneNumber');
  const validData = await data.validate(req.body);
  if (validData.error) {
    const errorMsg =validData.error.details[0].message.replace(/[^a-zA-Z ]/g, "")
    return next(new ApiError(409,errorMsg))
  } else {
    next()
  }
};

exports.validUserProfile = async(req,res,next)=>{
const data = joi.object({
  fullName: joi.string().lowercase().trim().max(30).min(6),
  phoneNumber: joi
  .string()
  .regex(/^[789]\d{9}$/)
  .message('invalid phone numbeer please check '),
})
const validData = await data.validate(req.body);
if(validData.error){
  const err = validData.error.details[0].message.replace(/[^a-zA-Z ]/g, "")
      return next(new ApiError(409,err))
    }
    else{
      next()
    }
}

