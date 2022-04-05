const joi = require('joi');

exports.validAddress = async (req) => {
  const data = joi.object({
    country: joi.string().min(2).max(30),
    state: joi.string().min(2).max(30),
    city: joi.string().lowercase(),
    street: joi.string(),
    houseNo: joi.string(),
    pinCode: joi.number().required(),
    phoneNumber: joi
      .string()
      .required()
      .regex(/^[789]\d{9}$/)
      .message('invalid phone numbeer please check your number'),
    fullName: joi.string().lowercase().trim().max(30).min(6).required(),
    landMark: joi.string().lowercase(),
    addressType: joi.string().lowercase().required(),
    isDefault: joi.boolean(),
  });
  const validData = await data.validate(req.body);
  return validData;
};
