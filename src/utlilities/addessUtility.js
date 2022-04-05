const { userAddress } = require('../models');

exports.addressPresent = async (req) => {
  if (req.body.phoneNumber) {
    const addPresent = await userAddress.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    return addPresent;
  } else if (req.query.id) {
    const addPresent = await userAddress.findOne({ _id: req.query.id });
    return addPresent;
  } else {
    return null;
  }
};
