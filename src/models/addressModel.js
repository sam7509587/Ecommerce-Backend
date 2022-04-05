const mongoose = require('mongoose');

const addSchema = mongoose.Schema(
  {
    userId: String,
    country: { type: String },
    state: { type: String },
    city: { type: String, enum: ['admin', 'seller', 'user'] },
    street: String,
    houseNo: String,
    pinCode: Number,
    phoneNumber: Number,
    fullName: String,
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
