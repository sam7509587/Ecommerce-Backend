const { userAddress } = require('../models');

exports.addressPresent = async (req) => {
  let addPresent;
  if(req.params.id){
     addPresent = await userAddress.findOne({
      _id: req.params.id,
    })
  }else{
    addPresent = await userAddress.findOne({
      userId: req.user.id})
  }
    if(addPresent){
      return addPresent
    }
    else{
      return null
    }
};
