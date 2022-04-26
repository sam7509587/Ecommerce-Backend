const { valid } = require('./mainValid');
const { validAdmin } = require('./adminValid');
const { validSeller,ValidSellerProfile } = require('./sellerValid');
const { validAddress,validAddEdit } = require('./addressValid');
const {validUserProfile} = require("./mainValid")
const {validProduct,validEntry,validBrand,validCategory}= require("./validProduct");
const { validCartDetails,validIncrement } = require('./validCartDetails');
const {validReview,validReviewEdit}=require("./reviewValidate");
const { validOrder } = require('./orderValidition.js');

module.exports = { valid,validOrder, validReviewEdit,validReview,validAdmin,validCartDetails,validIncrement, validSeller,validAddEdit, validAddress,validUserProfile,validProduct,validCategory ,validBrand,ValidSellerProfile,validEntry};
