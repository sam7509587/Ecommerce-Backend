const { User } = require("../models")
const {validAdmin } = require("../validations")
const { createUser } = require("../services")
const {  userPresent,verifyToken, sendOtp, sendMail } = require("../utlilities")
const jwt = require("jsonwebtoken")
const {SECRET_KEY, A1} = require("../config/index")

exports.showSeller = async (req, res) => {
   const admin =await verifyToken(req)
   if(admin!="err"){
       const sellers = await User.find({ role: "seller" }, { role: 1, email: 1, contact: 1, isVerified: 1, isApproved: 1 })
       res.status(200).json({ status: 200, mesage: "log in successfull : data found", sellers, success: true })
   }else{
       res.status(404).json({status :404,message: "invalid token ",success: false})
   }


}
exports.approveSeller = async (req, res) => {
    try {
        const _id = req.body.sellerId;
        const user = await User.findOne({_id})
        const admin =await verifyToken(req)
        if(admin !="err"){
            if (user===null) {
                res.status(404).json({
                    status: 404,
                    message: "user not found",
                    success: false
                })
            } else {
                if (user.isApproved === false) {
                    await User.updateOne({ _id }, { isApproved: true })
                    if(user.contact!=undefined){
                        req.body.contact=user.contact
                        otp = undefined
                        await sendOtp(req,otp,"you are approved by admin and now you can login !!")
                    }
                    else{
                        req.body.email=user.email
                        const token =undefined;
                        await sendMail(req,token,"you are approved by admin and now you can login !! ")    
                    }
                    res.status(200).json({ status: 200, message: "the user has been approved and now can login" })
                } else {
                    res.status(409).json({
                        status: 409,
                        message: "already approved",
                        success: false
                    })
                }
        }
        }else{
            res.status(401).json({
                status:401,message:"invalid token of admin",success:false
            })
        }
    } catch (err) {
        if (err.name === "CastError") {
            res.json({
                message: "invalid id format"
            })
        } else {
            console.log(err)
        }
    }
}

exports.loginAdmin = async (req,res,next) => {
    const adminPresent = await User.findOne({role:"admin"})
    if(adminPresent ===null){
        const validUser = await validAdmin(req)
        if (validUser === "noError") {
            const userAvailable = await userPresent(req)
            if (userAvailable ===null) {
                req.body.role = A1
                const newUser = await createUser(req)
                if(newUser === undefined){
                    res.status(403).json({status: 403,message:"error occured while saving data -may be role type is invalid",success:false})
                }else{
                    res.status(200).json({status : 200,message: "signup successfull !! login again"})
                }
            } else {
                res.status(409).json({status: 409,message: "email not available try another email"})
            }
        } else {
            res.status(403).json({status : 403,message:validUser,success: false })
        }
    }else{
       await this.enterAdmin(req,res);
    }
    
}

exports.enterAdmin=async(req,res)=>{
    const userAvailable = await userPresent(req)
    const admin = userAvailable;
    if(admin!= null){
        if(admin.password===req.body.password){
            const payload = {
                uad:admin._id
            }
            refreshToken = jwt.sign(payload,SECRET_KEY); 
            accessToken =jwt.sign(payload,SECRET_KEY); 
                res.status(200).json({
                    status:200,
                    accessToken,
                    message: "log in successfull",
                })
        }else{
            res.status(401).json({
                status: 401,
                message: "invalid password ",
                success: false
            })
        }
    }else{
        res.status(401).json({
            status:401,message:"wrong input - not a admin",success:false
        })
    }
   
}

