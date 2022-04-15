const {
  createUser,
  userLogin,
  verifyOtp,
  verifyToken,
  userPhoneLogin,
updateSellerBody} = require('./seller');
const { addressData } = require('./addressServices');
const {updateBody}= require("./mainService.js")
const {mailToUnverifed}=require("./cron")
module.exports = {
  createUser,
  userLogin,
  verifyOtp,
  verifyToken,
  userPhoneLogin,mailToUnverifed,
  addressData,updateBody,updateSellerBody
};
