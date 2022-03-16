const { User, otpModel } = require("../models")
const { PHONE, TWILIO_TOKEN, TWILIO_SID, USER_MAIL, USER_PASSWORD, PORT ,SECRET_KEY} = require("../config")
const twilio = require("twilio")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")

exports.userPresent = async (req) => {
    try {
        if(req.body.contact){
            const user = await User.findOne({contact:req.body.contact })
            return user
        }
        else if(req.body.email){
            const user = await User.findOne({email:req.body.email})
            return user
        }
    } catch (err) {
        return err
    }
}

exports.sendOtp = async (req,otp,msg) => {
    try {
        if(otp===undefined || null){
            msg = msg
        }else{
            msg = `${otp} ${msg}`
        }
        const contact = req.body.contact;
        const client = await new twilio(TWILIO_SID, TWILIO_TOKEN)
        await client.messages.create({
            body: msg,
            to: `+91${contact}`,
            from: PHONE
        })
        return req
    }
    catch (err) {
        return err = "err"
    }
}

exports.sendMail = async (req,token,msg) => {
    if(token===undefined || null){
        msg = msg
    }else{
        msg =  `<h1>${msg}</h1><br><a href="http://127.0.0.1:${port}/api/v1/seller/verify/${token}">"Click to Verify "`
    }
    const email = req.body.email
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: USER_MAIL,
            pass: USER_PASSWORD
        }
    });
    const mailOptions = {
        from: USER_MAIL,
        to: email,
        subject: 'Verify your mail',
        text: `Hey , it's our link to veriy the account and will going to expire in 10 mins  `,
        html: msg
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return error;
        }
        else {
            return info
        }
    });
}
exports.verifyToken=async(req)=>{
    if(req.headers.authorization !=undefined){
        const token = req.headers.authorization.split(" ")[1]
        const admin=await jwt.verify(token,SECRET_KEY,async(err,info)=>{
        if(err){
            return "err"
        }else{
            const admin =await User.findOne({_id:info.uad})
            return admin
        }
    })
    return admin
    }else {return "err"}
}

exports.generateOtp=()=>{
    let Otp = Math.floor((Math.random() * 1000000) + 1);
    return Otp
}
exports.checkExp=async(req)=>{
    if(req.body.email){
            const user = await User.findOne({email:req.body.email})
            const ExpDate = (Date.now()- user.tokenExp)/60000
            return ExpDate
    }else if (req.body.contact){
            const user = await User.findOne({contact:req.body.contact})
            const ExpDate = (Date.now()- user.otpExp)/60000
            return ExpDate
    
}else{
    const user = await User.findOne({resetToken:req.params.token})
    const ExpDate = (Date.now()- user.tokenExp)/60000
            return ExpDate
}}

