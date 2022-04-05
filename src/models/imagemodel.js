const mongoose =require("mongoose")

const photoSchema = mongoose.Schema({
  imageOf: String,
    imageUrl:String,
    publicId : String
}, { timestamps: true })

photoSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const imageModel= mongoose.model("imageModel",photoSchema)
module.exports = imageModel
