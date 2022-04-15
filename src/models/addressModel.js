const mongoose = require('mongoose');

const addSchema = mongoose.Schema(
  {
    userId: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    country: { type: String },
    state: { type: String },
    city: { type: String},
    street: String,
    houseNo: String,
    pinCode: Number,
    addressType: String,
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

addSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
const userAddress = mongoose.model('address', addSchema);
module.exports = userAddress;
