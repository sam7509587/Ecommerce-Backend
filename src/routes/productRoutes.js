const express = require('express');
const { SELLER } = require('../config');
const router = express.Router();
const { addProduct ,showProductSeller,editProduct,deleteProduct} = require('../controller');
const { checkRole,tokenVerify, formData } = require('../middleware');
const { validProduct, validEntry } = require('../validations');

router.post("/",tokenVerify,checkRole(SELLER),formData,validProduct,addProduct)
router.patch("/:id",tokenVerify,checkRole(SELLER),formData,validEntry,editProduct)
router.get("/get_products",tokenVerify,checkRole(SELLER),showProductSeller)
router.delete("/:id",tokenVerify,checkRole(SELLER),deleteProduct)
module.exports = router
