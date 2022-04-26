const joi = require("joi");
const { ApiError } = require("../config");
exports.validOrder = async (req,res,next) => {
    const data = joi
      .object({
        products: joi.array().items(joi.object({
          quantity: joi.number().min(1).required(),
          productId:joi.string().hex().length(24).required(),
        })).required(),
        addressId: joi.string().hex().length(24),
        paymentMode:joi.string().valid("COD","NB","UPI").required(),
        deliveryMode: joi.string().valid("standard","fast")
      });
    const validData = await data.validate(req.body);
    if (validData.error) {
      const errorMsg =validData.error.details[0].message.replace(/[^a-zA-Z 0-9 ]/g,"")
      return next(new ApiError(409,errorMsg))
    } else {
      next()
    }
  };
  // Joi.string().hex().length(24)
