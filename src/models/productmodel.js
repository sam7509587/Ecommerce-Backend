const mongoose =require("mongoose");

const produceSchema = mongoose.Schema({
createdBy: {type: mongoose.Schema.Types.ObjectId , ref: "User"},  
productName	:String,
categoryId:{type: mongoose.Schema.Types.ObjectId , ref: "category"},
brandId:{type: mongoose.Schema.Types.ObjectId , ref: "brand"},
price	:Number,
isAvailable	:{type: Boolean,default: true},
image:{type: mongoose.Schema.Types.ObjectId , ref: "image"},
rating	:Number,
quantity  :{type: Number,default :0},
description	:String,
isApproved	:{type: Boolean,default: false}

},{timestamps:true})

produceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
  
const product= mongoose.model("product",produceSchema)
module.exports = product
