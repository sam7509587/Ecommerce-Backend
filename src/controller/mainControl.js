const { ApiError, S1 } = require("../config")
const { valid } = require("../validations")
const { createUser, userLogin } = require("../services")
const { sendOtp, sendMail, userPresent,generateOtp } = require("../utlilities")

exports.login = async (req, res, next) => {
    const validUser = await valid(req)
    if (validUser === "noError") {
        const userAvailable = await userPresent(req)
        if (userAvailable==null) {
            req.body.role=S1;
            if (req.body.email) {
                const newUser = await createUser(req)
                const token = newUser.resetToken
                const sentMail = sendMail(req,token,"token is here and will expire in 10 min")
                if (sentMail.error) {
                    res.status(404).json({status:404,message:error,success:false})
                }
                else {
                    res.status(200).json({ status: 200, message: "sent mail ; and the token will expire 10 min", success: true })
                }
            }
            else if (req.body.contact) {
                const otp =generateOtp();
                req.body.otp = otp;
                req.body.otpExp = Date.now();
                const userCreated=await createUser(req)
                if(userCreated){
                    const sentOtp = await sendOtp(req,otp,"is your otp and will expire in 10 min")
                    console.log(sentOtp)
                    if(sentOtp=="err"){
                        res.status(400).json({status : 400,message : "unknown error occured -contact may not verified",success :false})
                    }else{
                        res.status(200).json({ status:200,message: "successfull signup otp sent ",success :true })
                    }
                }
            }
        } else {
            userLogin(req, res, userAvailable)
        }
    } else {
        res.status(403).json({status : 403,message:validUser,success: false })
    }
}
