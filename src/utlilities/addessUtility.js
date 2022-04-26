const { address } = require('../models');

exports.addressPresent = async (req) => {
  let addPresent;
  if(req.params.id){
     addPresent = await address.findOne({
      _id: req.params.id,
    })
  }else{
    addPresent = await address.findOne({
      userId: req.user.id})
  }
    if(addPresent){
      return addPresent
    }
    else{
      return null
    }
};
