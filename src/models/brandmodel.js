const mongoose =require("mongoose")
const brandSchema = mongoose.Schema({
    brandName : String,
    description : String,
    image:{type: mongoose.Schema.Types.ObjectId , ref: "image"},
    isActive: {type: Boolean,default:true}
}, { timestamps: true })

brandSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const brand= mongoose.model("brand",brandSchema)
module.exports = brand
