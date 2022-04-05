const async = require("hbs/lib/async");
const { ApiError, CLOUD_NAME, API_KEY, API_SECRET } = require("../config");
const { catagoryModel, brandModel, productModel, imageModel } = require("../models");
const cloudinary = require("cloudinary").v2
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true
});
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
  const brand = req.body.brand || req.data.brand
  const category = req.body.category || req.body.category
  if(!brand){
    return next(new ApiError(404,"brand id is required"))
  }
  if(!category){
  return  next(new ApiError(404,"category id is required"))
  }
  const categoryPresent = await catagoryModel.findOne({id:category});
  if(!categoryPresent){
    return  next(new ApiError(404,"category id is invalid"))
  }
  const brandPresent = await brandModel.findOne({id:brand});
  if(!brandPresent){
    return  next(new ApiError(404,"category id is invalid"))
  }
}

exports.brandCateEdit = async(req,res,next)=>{
  try{
  const brand = req.body.brand || req.data.brand
  const category = req.body.category || req.body.category
  if(brand){
    const brandPresent = await brandModel.findOne({_id:brand});
    if(!brandPresent){
      return  next(new ApiError(404,"brand id is invalid"))
    }
  }
  if(category){
    const categoryPresent = await catagoryModel.findOne({_id:category});
  if(!categoryPresent){
    return  next(new ApiError(404,"category id is invalid"))
  }
  }}
  catch(err){
    if(err.name == "CastError"){
    return next(new ApiError(409,err.message))
    }else{
      return next(new ApiError(400,err.message))
    }
  }
}

exports.EditPhoto=async(req,res,next)=>{
  folder = "seller"
  const publicId = req.body.publicId
  if(req.file){
   await cloudinary.uploader.destroy(publicId,async function(error,result) {
      if(error){
        return next(new ApiError(400,error))
      }else{
        if(result.result == "ok"){
          await imageModel.deleteOne({publicId:req.body.publicId})
          const fileName = req.file.destination + "/" + req.file.filename
          const photo = cloudinary.uploader.upload(fileName, {
            folder: `${folder}`,
            use_filename: true
          },async function (error, result) {
            if (result) {
              req.imageUrl = result.url;
              req.publicId = result.public_id;
              await imageModel.create({imageOf:req.imageOf,imageUrl:req.imageUrl,publicId:req.publicId})
              return true
            }else{
            return next(new ApiError(500, `error- ${error.message}`))}
      });
        }else{
          return next(new ApiError(400,`cloudinary error image :->${result.result}`))
        }
      }
    })  
  }else{
    return false
  }
}
