const { login } = require('./mainControl');
const { registerSelller,deleteSeller } = require('./sellerControl');
const { showSeller, loginAdmin, approveSeller,deleteUserParmanently,rejectSeller} = require('./adminControl');
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
const { addProduct,showProductSeller,editProduct,deleteProduct,showProduct ,deleteSinglePhoto
,approveProduct} = require('./productControl');
const {addReview,deleteReview,editReview,getAllreviews,getReview}=require("./reviewsControl");
const { placeOrder,getAllOrders,getOrder,cancelOrder,changeStatus,fetchDates } = require('./ordercontrol');
module.exports = {
  login,
  showSeller,getAllreviews,getReview,
  approveSeller,
  loginAdmin,fetchDates,
  registerSelller,
  registerUser,
  loginUser,changeStatus,
  createAddress,approveProduct,
  editAddress,rejectSeller,
  deleteAddress,editBrands,showAllBrands,deleteBrand,addReview,editReview,
  showAddress,deleteUser,getAddress,cancelOrder,deleteReview,
  addProduct,deleteSeller,deleteUserParmanently,placeOrder,getAllOrders,getOrder,
  showCountry,editUser,addBrand,addCategory,showProductSeller,editProduct,deleteProduct,showProduct,clearCart
  ,deleteSinglePhoto,showBrand,editCategorys,showAllCategorys,deleteCategory,showCategory,addToCart,deleteFromCart,incrementDecrement
  ,showCart};
