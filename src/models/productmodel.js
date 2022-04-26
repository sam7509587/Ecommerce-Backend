const mongoose =require("mongoose");

const produceSchema = mongoose.Schema({
createdBy: {type: mongoose.Schema.Types.ObjectId , ref: "User"},  
productName	:String,
categoryId:{type: mongoose.Schema.Types.ObjectId , ref: "category"},
brandId:{type: mongoose.Schema.Types.ObjectId , ref: "brand"},
price	: Number,
isAvailable	:{type: Boolean,default: true},
image:{type: mongoose.Schema.Types.ObjectId , ref: "image"},
rating	:{type: String},
quantity  :{type: Number,default :0},
description	:String,
isApproved	:{type: Boolean,default: false},
paymentMode : Array,
expectedDelivery : {type:Number,default:4},
reviews: [{type: mongoose.Schema.Types.ObjectId , ref: "review"}]
},{timestamps:true })

produceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      const date = new Date(+new Date() + this.expectedDelivery * 24 * 60 * 60 * 1000) 
      // ret.expectedDelivery = new Date(date);
    },
  });
  produceSchema.index({'$**': 'text'});  

  produceSchema.pre('save', async function (next) {
    if (!this.isModified('quantity')) return next();
    if(this.quantity == 0 ){
      this.isAvailable = false
    }
  });
const product= mongoose.model("product",produceSchema)
module.exports = product
