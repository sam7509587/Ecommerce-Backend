const { valid } = require('./mainValid');
const { validAdmin } = require('./adminValid');
const { validSeller,ValidSellerProfile } = require('./sellerValid');
const { validAddress } = require('./addressValid');
const {validUserProfile} = require("./mainValid")
const {validProduct,validEntry}= require("./validProduct")
module.exports = { valid, validAdmin, validSeller, validAddress,validUserProfile,validProduct ,ValidSellerProfile,validEntry};
