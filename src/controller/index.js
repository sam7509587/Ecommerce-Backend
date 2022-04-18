const { login } = require('./mainControl');
const { registerSelller,deleteSeller } = require('./sellerControl');
const { showSeller, loginAdmin, approveSeller,deleteUserParmanently,getUser,rejectSeller} = require('./adminControl');
const {addBrand,showBrand,editBrands,showAllBrands,deleteBrand} = require("./brandController")
const { registerUser, loginUser ,editUser,deleteUser} = require('./userController');
const {editCategorys,showAllCategorys,deleteCategory,showCategory,addCategory}=require("./categoryControl")
const {addToCart,deleteFromCart,incrementDecrement,showCart,clearCart}=require("./cartControl")

const {
  createAddress,
  editAddress,
  deleteAddress,
  showAddress,
  showCountry,getAddress,
} = require('./addressControl');
const { addProduct,showProductSeller,editProduct,deleteProduct,showProduct ,deleteSinglePhoto} = require('./productControl');
const {addReview,deleteReview,editReview}=require("./reviewsControl");
const { placeOrder,getAllOrders,getOrder,cancelOrder,changeStatus } = require('./ordercontrol');
module.exports = {
  login,
  showSeller,
  approveSeller,
  loginAdmin,
  registerSelller,
  registerUser,
  loginUser,changeStatus,
  createAddress,
  editAddress,rejectSeller,
  deleteAddress,editBrands,showAllBrands,deleteBrand,addReview,editReview,
  showAddress,deleteUser,getUser,getAddress,cancelOrder,deleteReview,
  addProduct,deleteSeller,deleteUserParmanently,placeOrder,getAllOrders,getOrder,
  showCountry,editUser,addBrand,addCategory,showProductSeller,editProduct,deleteProduct,showProduct,clearCart
  ,deleteSinglePhoto,showBrand,editCategorys,showAllCategorys,deleteCategory,showCategory,addToCart,deleteFromCart,incrementDecrement
  ,showCart};
