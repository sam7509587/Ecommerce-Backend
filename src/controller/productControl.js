
const { ApiError, S1, CLOUD_NAME, API_KEY, API_SECRET } = require('../config');
const { productModel,imageModel } = require('../models');
const { validProduct ,validEntry} = require('../validations')
const { productField, EditPhoto } = require("../utlilities");
const cloudinary = require("cloudinary");
const { checkBrandCategory,brandCateEdit } = require('../utlilities/productUtility');

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true
});

exports.addProduct = async (req, res, next) => {
  try {
    const validData = await validProduct(req);
    if (validData.error) {
      return next(new ApiError(422, validData.error.details[0].message))
    }
    await checkBrandCategory(req, res, next)
    if (req.file) {
      const folder = "products";
      const fileName = req.file.destination + "/" + req.file.filename
      const photo =await cloudinary.uploader.upload(fileName, function (result, error) {
        if (result) {
          req.imageUrl = result.url;
          req.publicId = result.public_id
          return result
        }
        return next(new ApiError(500, `${error.name} - ${error.message}`))
      }, {
        folder: `${folder}`,
        use_filename: true
      });
      req.body.createdBy = req.user._id
      
    }
    req.body.createdBy = req.user.id
    const newProduct = await productModel.create(req.body)
    await imageModel.create({
      imageOf: newProduct.id,
      imageUrl: req.imageUrl,
      publicId: req.publicId
    })
    return res.status(201).json({ status: 201, message: "product added successfully", newProduct, success: true, })
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ApiError(409, "id of brand or category is in wrong format"))
    }
    return next(new ApiError(409, `err  : ${err}`))
  }
}

exports.showProductSeller = async (req, res, next) => {

try{  var { page = 1, limit = 5 } = req.query;
  fields = productField(req)
  products = await productModel.find({ createdBy: req.user.id }, fields).limit(limit).skip((page - 1) * limit).sort({ createdBy: -1 })
  .populate("category","category")
  .populate("brand","brand")
  .populate("createdBy","fullName")
  res.status(200).json({
    status: 200,
    totalProducts: products.length,
    products,
    success: true
  })}catch(err){
 return  next (new ApiError(400,err.message))
  }
}
exports.editProduct = async(req, res,next) => {
  try{ const validData = await validEntry(req);
    if (validData.error) {
      return next(new ApiError(422, validData.error.details[0].message))
    }
    const product =await productModel.findOne({_id:req.body.productId});
    if(!product){
      return next(new ApiError(404,"no product found with this id"))
    }
    req.imageOf = product.id
    
    await brandCateEdit(req,res,next)
    publicId = req.body.publicId ;
     await EditPhoto(req,res,next)

    const updateProduct = await productModel.updateOne({createdBy:req.user.id},req.body,{new:true})
    res.status(200).json({status:200,updateProduct, success: false})
  }catch(err){
    if (err.name === "CastError") {
      return next(new ApiError(409, "check all ids may be format is wrong"))
    }
    return next(new ApiError(409, `err  : ${err}`))
  }
}
exports.deleteProduct = async(req,res,next)=>{
  try{
  const id = req.body.productId;
  if(!id){
      return next(new ApiError(404,"productId is required"))
  }
  const user = await productModel.findOne({id})
  if(!user){
    return next(new ApiError(404,"no product found"))
  }
  deletedData = await productModel.deleteOne({id},{new:true})
  return res.status(200).json({status: 200,
    success:true,deletedData
  })
}catch(err){
    if (err.name === "CastError") {
      return next(new ApiError(409, "id format is wrong"))
    }
    return next(new ApiError(409, `err  : ${err}`))
  }
  
}
