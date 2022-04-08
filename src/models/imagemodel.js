const mongoose =require("mongoose")

const photoSchema = mongoose.Schema({
  productId: {type:mongoose.Schema.Types.ObjectId,ref:"product"},
    images:[{imageUrl:String,
    publicId : String}],
    isActive : {type : Boolean , default : true}
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
