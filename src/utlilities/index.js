const {
  sendMail,
  userPresent,
  sendOtp,
  verifyToken,
  generateOtp,
  checkExp,
  verifyEmail,
  uploadPhoto,deletePhoto
} = require('./main');
const { adminData, fieldsToShow, sortByField } = require('./adminUtility');
const { sellerData } = require('./sellerUtility');
const { UserData } = require('./userUtility');
const { addressPresent } = require('./addessUtility');
const { checkCategoryBrand,brandCateEdit,EditPhoto,productField} = require('./productUtility');
module.exports = {deletePhoto,
  checkCategoryBrand,
  userPresent,
  sendOtp,
  sendMail,
  verifyToken,
  generateOtp,
  checkExp,
  adminData,
  verifyEmail,
  fieldsToShow,
  sortByField,
  UserData,
  sellerData,
  addressPresent,
  uploadPhoto,
  productField,checkCategoryBrand,brandCateEdit,EditPhoto
};
