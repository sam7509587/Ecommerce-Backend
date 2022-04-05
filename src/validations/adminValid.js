const joi = require('joi');

exports.validAdmin = async (req) => {
  const data = joi.object({
    name: joi.string(),
    email: joi.string().email().required(),
    address: joi.string(),
    isActive: joi.boolean(),
    password: joi.string().required(),
    profileImg: joi.string(),
    isVerified: joi.boolean(),
    resetToken: joi.string(),
  });
  const validData = await data.validate(req.body);
 return validData
};
