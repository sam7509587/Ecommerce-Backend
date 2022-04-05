const mongoose =require("mongoose")
const userSchema = mongoose.Schema({
    userId :  {type: mongoose.Schema.Types.ObjectId, ref: "userId"},
    gstNumber: String,
    document: String,
    isKyc: {type:Boolean,default:false},
}, { timestamps: true })

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  }); 
const sellerProfile= mongoose.model("sellerProfile",userSchema)
module.exports = sellerProfile
