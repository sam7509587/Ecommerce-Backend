const { login } = require('./mainControl');
const { registerSelller } = require('./sellerControl');
const { showSeller, loginAdmin, approveSeller} = require('./adminControl');
const {addBrand,showBrand,editBrands,showAllBrands,deleteBrand} = require("./brandController")
const { registerUser, loginUser ,editUser} = require('./userController');
const {editCategorys,showAllCategorys,deleteCategory,showCategory,addCategory}=require("./categoryControl")
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
  deleteAddress,editBrands,showAllBrands,deleteBrand,
  showAddress,
  addProduct,
  showCountry,editUser,addBrand,addCategory,showProductSeller,editProduct,deleteProduct,showProduct
  ,deleteSinglePhoto,showBrand,editCategorys,showAllCategorys,deleteCategory,showCategory
};
