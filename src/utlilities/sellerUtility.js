const { S1 } = require('../config');

exports.sellerData = (req) => {
  req.body.role = S1;
  return req.body;
};
