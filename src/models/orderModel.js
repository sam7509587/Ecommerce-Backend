const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"product"},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
});
orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const order = mongoose.model("review",orderSchema)
module.exports = order
