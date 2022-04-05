const joi = require('joi');

exports.valid = async (req) => {
  const data = joi
    .object({
      phoneNumber: joi.string(),
      password: joi.string().required(),
      email: joi.string().email(),
    })
    .xor('email', 'phoneNumber');
  const validData = await data.validate(req.body);
  if (validData.error) {
    const errorMsg = validData.error.details[0].message;
    return errorMsg;
  } else {
    const noError = 'noError';
    return noError;
  }
};

exports.validUserProfile = async(req)=>{
const data = joi.object({
  // gstNumber : joi.string(),
  // // .when('document', {is: joi.exist(), then: joi.required(), otherwise: joi.optional()}),
  // // regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
  // document:joi.string(),
  // // .when('gstNumber', {is: joi.exist(), then: joi.required(), otherwise: joi.optional()}),
  fullName: joi.string().lowercase().trim().max(30).min(6),
  phoneNumber: joi
  .string()
  .regex(/^[789]\d{9}$/)
  .message('invalid phone numbeer please check '),
})
const validData = await data.validate(req.body);  
return validData
}

