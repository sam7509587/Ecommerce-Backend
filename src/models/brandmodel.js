const mongoose =require("mongoose")
const brandSchema = mongoose.Schema({
    brand : String,
    description : String,
    image:String,
    isActive: Boolean
}, { timestamps: true })

brandSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const brandModel= mongoose.model("brandModel",brandSchema)
module.exports = brandModel
