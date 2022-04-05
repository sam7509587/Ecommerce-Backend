const { SELLER } = require('../config');

exports.sellerData = (req) => {
  req.body.role = SELLER;
  return req.body;
};
