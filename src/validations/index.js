const { valid } = require('./mainValid');
const { validAdmin } = require('./adminValid');
const { validSeller,ValidSellerProfile } = require('./sellerValid');
const { validAddress } = require('./addressValid');
const {validUserProfile} = require("./mainValid")
const {validProduct,validEntry,validBrand,validCategory}= require("./validProduct")
module.exports = { valid, validAdmin, validSeller, validAddress,validUserProfile,validProduct,validCategory ,validBrand,ValidSellerProfile,validEntry};
