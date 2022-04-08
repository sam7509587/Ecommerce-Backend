const mongoose =require("mongoose")

const catagory = mongoose.Schema({
    categoryName : String,
    description : String,
    image:String,
    isActive: {type: Boolean,default:true}
}, { timestamps: true })

catagory.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
const category= mongoose.model("category",catagory)
module.exports = category
