const mongoose =require("mongoose");

const photoSchema = mongoose.Schema({
  productId: {type:mongoose.Schema.Types.ObjectId,ref:"product"},
    images:[{imageUrl:String,
    publicId : String}],
    isActive : {type : Boolean , default : true},
    brandId:{type:mongoose.Schema.Types.ObjectId,ref:"brand"},
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:"category"},
    reviewId:{type:mongoose.Schema.Types.ObjectId,ref:"review"}
}, { timestamps: true })

photoSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const image= mongoose.model("image",photoSchema)
module.exports = image
