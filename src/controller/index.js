const { login } = require('./mainControl');
const { registerSelller } = require('./sellerControl');
const { showSeller, loginAdmin, approveSeller,addBrand,addCategory} = require('./adminControl');
const { registerUser, loginUser ,editUser} = require('./userController');
const {
  createAddress,
  editAddress,
  deleteAddress,
  showAddress,
  showCountry,
} = require('./addressControl');
const { addProduct,showProductSeller,editProduct,deleteProduct,showProduct ,deleteSinglePhoto} = require('./productControl');
module.exports = {
  login,
  showSeller,
  approveSeller,
  loginAdmin,
  registerSelller,
  registerUser,
  loginUser,
  createAddress,
  editAddress,
  deleteAddress,
  showAddress,
  addProduct,
  showCountry,editUser,addBrand,addCategory,showProductSeller,editProduct,deleteProduct,showProduct
  ,deleteSinglePhoto
};
