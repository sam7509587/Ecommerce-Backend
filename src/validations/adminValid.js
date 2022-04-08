const joi = require('joi');

exports.validAdmin = async (req) => {
  const data = joi.object({
    name: joi.string().trim(),
    email: joi.string().email().trim().required(),
    address: joi.string().trim(),
    isActive: joi.boolean().trim(),
    password: joi.string().required().trim(),
    profileImg: joi.string().trim(),
    isVerified: joi.boolean().trim(),
    resetToken: joi.string().trim(),
  });
  const validData = await data.validate(req.body);
 return validData
};
