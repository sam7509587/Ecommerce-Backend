const mongoose =require("mongoose")

const catagory = mongoose.Schema({
    category : String,
    description : String,
    image:String,
    isActive: Boolean
}, { timestamps: true })

catagory.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const catagoryModel= mongoose.model("catagoryModel",catagory)
module.exports = catagoryModel
