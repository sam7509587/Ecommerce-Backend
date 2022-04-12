const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"product"},
    quantity: Number,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
});
cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const cart = mongoose.model("cart",cartSchema)
module.exports = cart
