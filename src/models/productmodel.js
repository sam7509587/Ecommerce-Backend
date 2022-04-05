const mongoose =require("mongoose");

const produceSchema = mongoose.Schema({
createdBy: {type: mongoose.Schema.Types.ObjectId , ref: "User"},  
productName	:String,
category	:{type: mongoose.Schema.Types.ObjectId , ref: "catagoryModel"},
brand:{type: mongoose.Schema.Types.ObjectId , ref: "brandModel"},
price	:Number,
isAvailable	:{type: Boolean,default: true},
rating	:Number,
quantity  :{type: Number,default :0},
description	:String,
isApproved	:{type: Boolean,default: false},

},{timestamps:true})

produceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
  
const productModel= mongoose.model("productModel",produceSchema)
module.exports = productModel
