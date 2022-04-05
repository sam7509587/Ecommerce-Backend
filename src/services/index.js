const {
  createUser,
  userLogin,
  verifyOtp,
  verifyToken,
  userPhoneLogin,
updateSellerBody} = require('./seller');
const { addressData } = require('./addressServices');
const {updateBody}= require("./mainService")
module.exports = {
  createUser,
  userLogin,
  verifyOtp,
  verifyToken,
  userPhoneLogin,
  addressData,updateBody,updateSellerBody
};
