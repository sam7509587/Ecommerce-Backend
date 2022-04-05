const mongoose = require('mongoose');
const crypto = require('crypto');
const { SECRET_KEY, ENCODED_DATA, EN_TYPE } = require('../config/index');

const userSchema = mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    role: { type: String, enum: ['admin', 'seller', 'user'] },
    fullName: String,
    password: String,
    photoUrl: { type: String, default: null },
    aboutUs: String,
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExp: { type: Date, default: null },
    resetToken: { type: String },
    tokenExp: { type: Date, default: null },
    deletedAt: { type: Boolean, default: null },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  this.resetToken = crypto.randomBytes(20).toString(EN_TYPE);
  this.tokenExp = Date.now();
  next();
});
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
const User = mongoose.model('User', userSchema);
module.exports = User;
