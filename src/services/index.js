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
const {saveOrder}= require("./orderServices");
const { checkRoute} = require('./public');
module.exports = {
  checkRoute,
  createUser,
  userLogin,
  verifyOtp,
  verifyToken,
  userPhoneLogin,mailToUnverifed,
  addressData,updateBody,updateSellerBody,saveOrder
};
