const { order } = require("../models");
exports.saveOrder=(req)=>{
    const {addressId,paymentMode,deliveryMode,products} = req.body;
    const data = new order({userId: req.user.id,
      products,addressId})
    if(addressId)  {data.addressId = addressId};
    if(paymentMode) { data.paymentMode};
    if(deliveryMode) { 
      if(deliveryMode === "fast"){
        data.deliveryTime =new Date(+new Date() + 1 * 24 * 60 * 60 * 1000)
      }
    }
   return data.save()
}
