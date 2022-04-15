const { valid } = require('./mainValid');
const { validAdmin } = require('./adminValid');
const { validSeller,ValidSellerProfile } = require('./sellerValid');
const { validAddress,validAddEdit } = require('./addressValid');
const {validUserProfile} = require("./mainValid")
const {validProduct,validEntry,validBrand,validCategory}= require("./validProduct");
const { validCartDetails,validIncrement } = require('./validCartDetails');

module.exports = { valid, validAdmin,validCartDetails,validIncrement, validSeller,validAddEdit, validAddress,validUserProfile,validProduct,validCategory ,validBrand,ValidSellerProfile,validEntry};
