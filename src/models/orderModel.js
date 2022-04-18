const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  quantity: Number,
  address : { type: mongoose.Schema.Types.ObjectId, ref: "address" },
  deliveryTime: { type: Date, default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) },
  status : {type: String , enum: ["ordered","shipped","delivered","cancelled"],default:"ordered"}
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
