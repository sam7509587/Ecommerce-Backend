
const { ApiError, SELLER, ADMIN, USER, PUBLIC } = require('../config');
const { product, image, brand, category } = require('../models');
const { productField, deletePhoto, uploadPhoto, deleteImages, createFilter,filters, sendMail } = require("../utlilities");
const ObjectId = require('mongoose').Types.ObjectId;

exports.addProduct = async (req, res, next) => {
  try {
    const {productName,categoryId,brandId} = req.body;
    const brandFound =await brand.findOne({_id:brandId});
    if(!brandFound){
      return next(new ApiError(400,"no brand found with this id"));
    }
    const categoryFound =await category.findOne({_id:categoryId});
    if(!categoryFound){
      return next(new ApiError(400,"no category found with this id"));
    }
    const productFound =  await product.findOne({productName });
    if(productFound){
      return next(new ApiError(409,"name already present"))
    }
  
    if (req.files) {
      if (req.files.length > 0) {
        await uploadPhoto(req, next, "products")
        imageData = { images: req.uplodedFiles }
        const savedImages = await image.create(imageData)
        req.imageSaved = savedImages
      }
    }
    if (req.body) {
      req.body.createdBy = req.user.id;
      if (!req.imageSaved) {
        const newProduct = await product.create(req.body)
        const productfound = await product.findOne({ _id: newProduct.id })
          .populate("categoryId", "categoryName")
          .populate("brandId", "brandName")
          .populate("createdBy", "fullName")
        return res.status(201).json({ statusCode: 201, message: "product added successfully",data: productfound})
      } else {
        req.body.image = req.imageSaved.id;
        const newProduct = await product.create(req.body)
        req.imageSaved.productId = newProduct.id
        await req.imageSaved.save()
        const productfound = await product.findOne({ _id: newProduct.id })
          .populate("image", "images.imageUrl")
          .populate("categoryId", "categoryName")
          .populate("brandId", "brandName")
          .populate("createdBy", "fullName")
        return res.status(201).json({ statusCode: 201, message: "product added successfully",data: productfound})
      }
    }
  } catch (err) {
    if (err.name === "CastError" || err.name === "ValidationError") {
      return next(new ApiError(409, "id of brand or category is in wrong format"))
    }
    return next(new ApiError(409, `err  : ${err.name}`))
  }
}

exports.showProductSeller = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    if(page <=0||limit<=0){
      return next(new ApiError(409,"limit or page can not be eqaul or less than zero"))
    }
    const fields = productField(req, res, next)
    const filter = filters(req, res, next)
    const search = createFilter(req.query.search)
    if(req.user.role === SELLER){
      const neObj ={createdBy: req.user.id,$or:search}
      const query =Object.assign(filter,neObj)
      const data = await product.find( query, fields )
      .limit(limit).skip((page-1) * limit).sort({ createdBy: -1 })
        .populate("categoryId", "categoryName")
        .populate("brandId", "BrandName")
        .populate("createdBy", "fullName")
        .populate("image", "_id images.imageUrl")
      return res.status(200).json({
        statusCode: 200,
        totalProducts: data.length,
        data,
      })
    }
    if(req.user.role === ADMIN){
      const data = await product.find({$or:search}, fields )
      .limit(limit).skip((page-1) * limit).sort({ createdBy: -1 })
        .populate("categoryId")
        .populate("brandId")
        .populate("createdBy")
        .populate("image")
      return res.status(200).json({
        statusCode: 200,
        totalProducts: data.length,
        data,
      })
    }
     if(req.user.role === USER || req.user.role === PUBLIC){
      const data = await product.find({isApproved:true,$or:search}, fields )
      .limit(limit).skip((page-1) * limit).sort({ createdBy: -1 })
        .populate("categoryId","categoryName")
        .populate("brandId","BrandName")
        .populate("createdBy","fullName")
        .populate("image", "_id images.imageUrl")
      return res.status(200).json({
        statusCode: 200,
        message:"data found",
        data,
      })
     }
  } catch (err) {
    if (err.name === "ObjectParameterError") {
      return next(new ApiError(409, "enter correct querys to get the values"))
    }
    return next(new ApiError(400, err.message))
  }
}
///////////////////////////////////////
exports.editProduct = async (req, res, next) => {
  try {
    const {brandId,categoryId} = req.body
    const productPresent = await product.findOne({ _id: req.params.id });
    if (!productPresent) {
      return next(new ApiError(404, "no product found with this id"))
    }
    if (!req.body && !req.files) {
      return next(new ApiError(404, "nothing to change"))
    }
    if (Object.keys(req.body).length === 0 && req.files === undefined) {
      return next(new ApiError(404, "nothing to change"))
    }
    if(brandId){
      const brandFound =await brand.findOne({_id:brandId});
      if(!brandFound){
        return next(new ApiError(400,"no brand found with this id"));
      }
    }
    if(categoryId){
      const categoryFound =await category.findOne({_id:categoryId});
      if(!categoryFound){
        return next(new ApiError(400,"no category found with this id"));
      }
    }
    req.product = productPresent
    // await brandCateEdit(req, res, next)
    if (req.files) {
      if (req.files.length > 0) {
        if (!req.product.image) {
          await uploadPhoto(req, next, "products")
          const imageData = { productId: req.product.id, images: req.uplodedFiles }
          const savedImages = await image.create(imageData)
          req.body.image = savedImages.id
        }
        else {
          const imagesData = await image.findOne({ id: req.product.image })
          await deletePhoto(req, next, imagesData)
          await uploadPhoto(req, next, "products")
          const imageData = { images: req.uplodedFiles }
          const savedImages = await image.findOneAndUpdate({ productId: req.product.id }, imageData, { new: true })
        }
      }
    }
    if (req.body) {
      const updated = await product.findOneAndUpdate({ id: productPresent.id }, req.body, { new: true })
        .populate("image", "images.imageUrl")
        .populate("categoryId", "categoryName")
        .populate("brandId", "brandName")
        .populate("createdBy", "fullName")
      return res.status(201).json({ statusCode: 201, message: "product updated successfully",data: updated})}
    else {
      const updated = req.product.populate("image", "images.imageUrl")
        .populate("categoryId", "categoryName")
        .populate("brandId", "brandName")
        .populate("createdBy", "fullName")
      return res.status(201).json({ statusCode: 201, message: "product's image updated successfully"})
    }

  } catch (err) {
    if (err.name === "CastError") {
      return next(new ApiError(409, "check all ids may be format is wrong"))
    }
    return next(new ApiError(409, `err  : ${err}`))
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return next(new ApiError(404, "productId is required"))
    }
    const user = await product.findOne({ _id: id, isActive: true })
    if (!user) {
      return next(new ApiError(404, "no product found"))
    }
    const deletedProduct = await product.findOne({ _id: id }).populate("image")
    if (deletedProduct.image) {
      const imageData = await image.findOne({ createdBy: req.params.id })
      await deletePhoto(req, next, imageData)
      imageData.remove();
      deletedProduct.isActive = false;
      deletedProduct.image = undefined
      deletedProduct.save()
    } else {
      deletedProduct.isActive = false;
      deletedProduct.save()
    }
    return res.status(200).json({
      statusCode: 200,
      message: "deleted successfull !!",
      data: deletedProduct,
    })
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ApiError(409, "id format is wrong"))
    }
    return next(new ApiError(409, `err  : ${err}`))
  }
}

exports.showProduct = async (req, res, next) => {
  try {
    const fields = productField(req)
    const products = await product.findOne({ _id: req.params.id, isActive: true }, fields)
      .populate("image", "images.imageUrl")
      .populate("categoryId", "categoryName")
      .populate("brandId", "brandName")
      .populate("createdBy", "fullName")
    if (!products) {
      return next(new ApiError(404, "no product found;"))
    }
    return res.status(200).json({ statusCode: 200, data: products })
  }
  catch (err) {
    return next(new ApiError(400, err.message))
  }
}

exports.deleteSinglePhoto = async (req, res, next) => {
  const publicId = req.query.public_id
  const productId = req.params.id
  if (!publicId) {
    return next(new ApiError(404, "no public_ids found to delete image..."))
  }
  const imageData = await deleteImages(productId, publicId)
}

exports.approveProduct=async(req,res,next)=>{
  const _id = req.params.id
  if (!ObjectId.isValid(_id)) {
    return next(new ApiError(409, "id is in wrong format"))
}
  const productFound = await product.findOne({_id});
  if(productFound.isApproved){
    return next(new ApiError(400,"already approved"));
  }
  productFound.isApproved = true;
  productFound.save()
  return res.status(200).json({statusCode: 200 , message :"product has been approved",data :productFound})
}
