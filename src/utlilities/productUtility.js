const async = require("hbs/lib/async");
const { ApiError } = require("../config");
const { category, brand, image } = require("../models");

exports.productField=(req)=>{
    if (req.query.fields) {
        const arrayField = req.query.fields.toString();
        const arr = arrayField.split(',').filter((element) => element);
        let fields = {};
        arr.map((i) => {
          fields[i] = 1;
        });
        return fields;
      } else {
        const fields = {
            productName	:1,
            category	:1,
            brand: 1,
            price	:1,
            image:1,
            isAvailable	:1,
            rating	:1,
            quantity  :1,
            description	:1,
            isApproved	:1,
            
        };
        return fields;
      }
}

exports.brandCateEdit=async(req,res,next)=>{
  const brandId = req.body.brandId
  const categoryId = req.body.categoryId
  const categoryPresent = await category.findOne({_id:categoryId});
  if(categoryId){
    if(!categoryPresent){
      return  next(new ApiError(404,"category id is invalid"))
    }
  }
if(brandId){
  const brandPresent = await brand.findOne({_id:brandId});
  if(!brandPresent){
    return  next(new ApiError(404,"category id is invalid"))
  }
}
}
exports.filters=(req,res,next)=>{
  const { filter } = req.query;
  if(!filter){
    return { createdBy: req.user.id,isActive:true }
  }
  else{
        const filterData = IsJsonString(filter)
        if(!filterData){
          next(new ApiError(409,"enter filter in correct format to get values; example -{'key':'value'}"));
        }
        else{
          const newFilter = Object.assign({ createdBy: req.user.id ,isActive:true }, JSON.parse(filter));
          const array = ["productName",
            "categoryId",
            "brandId",
            "price",
            "images",
            "rating",
            "quantity", "description", "isApproved"
          ]
          const keysrray = Object.keys(JSON.parse(req.query.filter))
       const validFilter =  array.some(item => keysrray.includes(item))
       if(!validFilter){
      next(new ApiError(409,"enter correct fields to get values"))
       }
       else {
         return newFilter
       }
        }
  }
}
function IsJsonString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}
exports.deleteImages=async(product,publicId)=>{
  const ids = publicId.split(",").filter((element) => element);
  // const urls = await image.findOneAndUpdate({productId:product},{ $pull: { "images": { "publicId": publicId }}})
  const urls = await image.find({images: {$elemMatch: {publicId}}})
    return urls
}
exports.createFilter=(values)=>{
    const digit = (/^\d+$/).test(values);
    const newArray = []
      regex = new RegExp(values, "i")
     const arr = ["productName"]
    arr.forEach(element => { newArray.push({ [element]: regex }) });
    return newArray
  
}
