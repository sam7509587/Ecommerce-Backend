const joi = require("joi")

exports.validAdmin = async (req) => {
    const data = joi.object({
        name: joi.string(),
        email: joi.string().email(),
        address: joi.string(),
        isActive: joi.boolean(),
        password: joi.string().required(),
        profileImg: joi.string(),
        isVerified: joi.boolean(),
        resetToken: joi.string(),
    }).or("email");
    const validData = await data.validate(req.body)
    if(validData.error){
        const errorMsg = validData.error.details[0].message
        return errorMsg
    }else{
        const noError = "noError"
        return noError
    }
}
