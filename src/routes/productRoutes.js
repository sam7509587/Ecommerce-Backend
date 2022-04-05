const express = require('express');
const { S1, A1 } = require('../config');
const router = express.Router();
const { addProduct ,showProductSeller,editProduct,deleteProduct} = require('../controller');
const { checkRole,tokenVerify } = require('../middleware');
const { uploadPhoto,deletePhoto } = require('../utlilities');


router.post("/auth/add_product",tokenVerify,checkRole(S1),uploadPhoto,addProduct)
router.post("/auth/get_products",tokenVerify,checkRole(S1),showProductSeller)
router.patch("/auth/edit_products",tokenVerify,checkRole(S1),deletePhoto,editProduct)
router.delete("/auth/delete_products",tokenVerify,checkRole(S1),deletePhoto,deleteProduct)

router.post("/upload",uploadPhoto)
module.exports = router
