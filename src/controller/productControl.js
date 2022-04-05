
const { ApiError, SELLER, CLOUD_NAME, API_KEY, API_SECRET } = require('../config');
const { product, image } = require('../models');
const { validEntry } = require('../validations')
const { productField, EditPhoto, uploadPhoto } = require("../utlilities");
const { checkBrandCategory, brandCateEdit } = require('../utlilities/productUtility');

exports.addProduct = async (req, res, next) => {
  try {
    await checkBrandCategory(req, res, next)
    if (req.files.length > 0) {
      await uploadPhoto(req, "products", next)
      imageData = { images: req.uplodedFiles }
      const savedImages = await image.create(imageData)
      req.imageSaved = savedImages
    }
    if (req.body) {
      req.body.createdBy = req.user.id;
      if (!req.imageSaved) {
        const newProduct = await product.create(req.body)
        return res.status(201).json({ status: 201, message: "product added successfully", newProduct, success: true, })
      } else {
        req.body.image = req.imageSaved.id;
        const newProduct = await product.create(req.body)
        req.imageSaved.productId = newProduct.id
        await req.imageSaved.save()
        const productfound = await product.findOne({id:newProduct}).populate("image")
        return res.status(201).json({ status: 201, message: "product added successfully", productfound, success: true, })
      }
    }
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ApiError(409, "id of brand or category is in wrong format"))
    }
    return next(new ApiError(409, `err  : ${err.name}`))
  }
}

exports.showProductSeller = async (req, res, next) => {
  try {
    var { page = 1, limit = 5 } = req.query;
    fields = productField(req)
    const products = await product.find({ createdBy: req.user.id }, fields).limit(limit).skip((page - 1) * limit).sort({ createdBy: -1 })
      .populate("categoryId", "categoryId")
      .populate("brandId", "brandId")
      .populate("createdBy", "fullName")
      .populate("image","_id images.imageUrl")
    res.status(200).json({
      status: 200,
      totalProducts: products.length,
      products,
      success: true
    })
  } catch (err) {
    return next(new ApiError(400, err.message))
  }
}
exports.editProduct = async (req, res, next) => {
  try {
    const productPresent = await product.findOne({ _id: req.params.id });
    if (!productPresent) {
      return next(new ApiError(404, "no product found with this id"))
    }
    if (req.body.length===undefined && req.files===undefined ) {
      return next(new ApiError(404, "nothing to change"))
    }
    req.product = productPresent
    await brandCateEdit(req, res, next)
    if (req.files.length > 0) {
      await EditPhoto(req, res, next)
      await uploadPhoto(req, "products", next)
      imageData = { images: req.uplodedFiles }
      const savedImages = await image.findOneAndUpdate({ productId: req.product.id }, imageData, { new: true })
      req.imageSaved = savedImages
    }
    if (req.body) {
      const updated = await product.findOneAndUpdate({ id: productPresent.id }, req.body, { new: true })
      .populate("image")
      return res.status(201).json({ status: 201, message: "product added successfully", updated, success: true, })
    }

  } catch (err) {
    if (err.name === "CastError") {
      return next(new ApiError(409, "check all ids may be format is wrong"))
    }
    console.log(err)
    return next(new ApiError(409, `err  : ${err}`))
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return next(new ApiError(404, "productId is required"))
    }
    const user = await product.findOne({id})
    if (!user) {
      return next(new ApiError(404, "no product found"))
    }
    const deletedProduct =  await product.findOneAndDelete({ id }).populate("image")
    await image.deleteOne({createdBy:req.params.id})
    return res.status(200).json({
      status: 200,
      success: true, deletedProduct,
      message: "deleted successfull !!"
    })
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ApiError(409, "id format is wrong"))
    }
    return next(new ApiError(409, `err  : ${err}`))
  }

}
