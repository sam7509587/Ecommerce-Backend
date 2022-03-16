const {User} = require("../models")
const {sendMail,sendOtp,checkExp,generateOtp} = require("../utlilities")
const {SECRET_KEY} = require("../config/index")
const jwt = require("jsonwebtoken")
exports.createUser = async(req)=>{
    const newUser =await User.create(req.body)
    return newUser
}
exports.userLogin = async(req,res,userLogin)=>{
    if (userLogin.password === req.body.password) {
        if (userLogin.isVerified === true) {
            if (userLogin.isApproved === true) {
                const payload = {
                    uad:userLogin._id
                }
                refreshToken = jwt.sign(payload,SECRET_KEY); 
                accessToken =jwt.sign(payload,SECRET_KEY); 
                res.status(200).json({
                    message: "log in successfull",
                    refreshToken,
                    accessToken,
                    status: 200,
                    success: true
                })
            } else {
                res.status(401).json({
                    message: "you are not approved by admin , kindly wait",
                    status: 401,
                    success: false
                })
            }
        }else{
            if(req.body.contact){
                const expDate = await checkExp(req)
                if( expDate>=10){
                    const otp = generateOtp()
                    await sendOtp(req,otp,"is your otp and will expire in 10 min")
                    await User.updateOne({contact:req.body.contact},{otp,otpExp:Date.now()})
                    res.status(401).json({status:401,message : "Already a user ; Otp has been sent kindly verify in 10 min "})
                }else{
                    res.status(401).json({status:401,message : "otp time not expired yet kindly wait for 10 min to get new otp"})
                }
            }
            else if (req.body.email){
                const expDate =   await checkExp(req)
                if( expDate>=10){
                const token = userLogin.resetToken ; 
                await sendMail(req,token,"Verify your Account")
                await User.updateOne({email:req.body.email},{tokenExp:Date.now()})
                res.status(401).json({status:401,message : "Already a user ; email has been sent kindly verify in 10 min "})}
                else{
                    res.status(401).json({status:401,message : "token time is not expired yet kindly wait for 10 min to get new token"})
                }
            }
        }
    }else{
        res.status(401).json({message : "wrong password !!",
        status: 401,
    success : false})
    }
}

exports.verifyToken = async (req,res,next) => {
    const expDate =   await checkExp(req)
        const resetToken = req.params.token
        const user = await User.findOne({resetToken})
        if(resetToken){
        if (user) {
            if (user.isVerified === false) {
                if(expDate<=10){
                await User.updateOne({ resetToken }, { isVerified: true ,refreshToken: null})
                res.status(200).json({
                    message: "user verfified successfull !! wait for admins approval",
                    status: 200,
                    success: true
                })}else{
                    res.status(401).json({status: 401,message:"token expired",success:false})
                }
            }
            else {
                res.json({
                    message: "already verified",
                    success: false
                })
            }
        } else {
            next(ApiError.Unauthorised("invalid token"))
        }}else{
           next(ApiError.BadRequest("No token found"))
        }
    }

exports.verifyOtp = async (req, res) => {
    const contact = req.body.contact;
    const Otp = req.body.otp
    console.log(Otp)
    const user = await User.findOne({contact})
    if (user) {
        if (user.isVerified === false) {
            console.log(user.otp)
            if (user.otp === Otp) {
                await User.updateOne({ contact }, { isVerified: true ,otp:null,otpExp:null})
                res.status(200).json({
                    message: "user verfified successfull !! wait for admins approval",
                    status: 200,
                    success: true
                })
            } else {
                res.status(401).json({
                    message: "invalid otp",
                    status: 401,
                    success: false
                })
            }
        } else {
            res.json({
                message: "already verified",
                success: false
            })
        }
    } else {
        res.status(404).json({
            message: "user not found ",
            status: 404,
            success: false
        })
    }
}
