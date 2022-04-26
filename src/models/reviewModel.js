const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"product"},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    rating: Number,
    comment:String,
    images: {type:mongoose.Schema.Types.ObjectId,ref:"image"}
});
reviewSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const review = mongoose.model("review",reviewSchema)
module.exports = review
