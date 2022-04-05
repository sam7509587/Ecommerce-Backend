const async = require("hbs/lib/async");
const { ApiError, CLOUD_NAME, API_KEY, API_SECRET } = require("../config");
const { category, brand, product, image } = require("../models");

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
exports.checkBrandCategory=async(req,res,next)=>{
  const brandId = req.body.brandId
  const categoryId = req.body.categoryId
  if(!brandId){
    return next(new ApiError(404,"brand id is required"))
  }
  if(!categoryId){
  return  next(new ApiError(404,"category id is required"))
  }
  const categoryPresent = await category.findOne({id:categoryId});
  if(!categoryPresent){
    return  next(new ApiError(404,"category id is invalid"))
  }
  const brandPresent = await brand.findOne({id:brandId});
  if(!brandPresent){
    return  next(new ApiError(404,"category id is invalid"))
  }
}


exports.brandCateEdit=async(req,res,next)=>{
  const brandId = req.body.brandId
  const categoryId = req.body.categoryId
  const categoryPresent = await category.findOne({id:categoryId});
  if(categoryId){
    if(!categoryPresent){
      return  next(new ApiError(404,"category id is invalid"))
    }
  }
if(brandId){
  const brandPresent = await brand.findOne({id:brandId});
  if(!brandPresent){
    return  next(new ApiError(404,"category id is invalid"))
  }
}
}
