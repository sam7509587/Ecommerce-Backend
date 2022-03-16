const mongoose = require("mongoose");
const crypto =require("crypto")
const {SECRET_KEY,ENCODED_DATA,EN_TYPE} = require("../config/index");

const userSchema = mongoose.Schema({
    role: {type: String,enum:["admin","seller","user"]},
    name: String,
    email: {type: String},
    contact: {type: String},
    address: String,
    isActive: {type: Boolean , default: false},
    password: String,
    profileImg: String,
    otp:String,
    otpExp: {type:Date},
    isVerified: {type: Boolean , default: false},
    isApproved:  {type: Boolean , default: false},
    resetToken: {type:String},
    tokenExp:{type : Date,default:null},
    isDeactivated: {type : Boolean , default: false}
},{timestamps: true})


userSchema.pre("save",async function(next){
  // const token = crypto.createHash('sha256',SECRET_KEY).update(ENCODED_DATA).digest(EN_TYPE);
  this.resetToken = crypto.randomBytes(20).toString(EN_TYPE);
  this.tokenExp = Date.now()
  next()
})    
const User = mongoose.model("User",userSchema)

module.exports = User

