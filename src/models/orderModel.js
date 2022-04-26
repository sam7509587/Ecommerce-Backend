const mongoose = require("mongoose");
const range = Math.floor(Math.random() * (6 - 3) + 3);
const orderSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    quantity: Number,
    price: Number
  }],
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
  paymentMode: { type: String, enum: ["COD", "NB", "UPI"], default: "COD" },
  deliveryTime: { type: Date, default: new Date(+new Date() + range * 24 * 60 * 60 * 1000) },
  status: {
      type: String,
      enum: ["ordered", "packed", "shipped", "delivered","canceled"],
      default: "ordered",
  },
  totalPrice: Number
});
orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
const order = mongoose.model("order", orderSchema)
module.exports = order
