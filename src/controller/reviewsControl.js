const { ApiError } = require("../config");
const { product, order, review, image } = require("../models");
const { findOne } = require("../models/userModel");
const { uploadPhoto, deletePhoto } = require("../utlilities");
const ObjectId = require('mongoose').Types.ObjectId;

exports.addReview = async (req, res, next) => {
  const _id = req.params.id;
  const { rating, comment } = req.body;
  if (!ObjectId.isValid(_id)) {
    return next(new ApiError(409, "id is in wrong format"))
  }
  const productFound = await product.findOne({ _id, isActive: true })
  if (!productFound) {
    return next(new ApiError(400, "no product found"))
  }
  const orderFound = await order.findOne({ userId: req.user.id, productId: _id, status: "delivered" })
  if (!orderFound) {
    return next(new ApiError(400, "only users who have bought the product can give reviews"))
  }
  const reviewFound = await review.findOne({ productId: _id, userId: req.user.id })
  if(reviewFound){
    return next(new ApiError(400,"you have already commented on this prodcut"))
  }
  let imageData ;
  if (req.files) {
    if (req.files.length > 0) {
      await uploadPhoto(req, next, "review")
      imageData = await image.create({
        images: req.uplodedFiles
      })
    }
  }
  newComment = new review({
    productId: _id,
    userId: req.user.id, comment, rating, images: (imageData.id)
  })
  const data = await newComment.save()
  imageData.reviewId = data.id;
  await imageData.save();
  productFound.reviews.push(data.id)
  await productFound.save();
  const dataFound = await review.findOne({_id:data.id}).populate("images","images.imageUrl")
  return res.status(201).json({
    statusCode: 201, message: "commented successfull !!", data:dataFound
  })
}

exports.editReview = async (req, res, next) => {
  const _id = req.params.id;
  const { rating, comment } = req.body;
  if (!ObjectId.isValid(_id)) {
    return next(new ApiError(409, "id is in wrong format"))
  }
  const reviewFound = await review.findOne({ _id, isActive: true })
  if (!reviewFound) {
    return next(new ApiError(400, "no review found"))
  }
  if(req.files){
    if(req.files.length>0){
      await uploadPhoto(req, next, "review");
      if(reviewFound.images){
        const imageData = await image.findOne({reviewId: _id})
        await deletePhoto(req,next,imageData)
        imageData.images= req.uplodedFiles;
        imageData.save()
      }
      else{
        await uploadPhoto(req, next, "review")
          const imageData = { reviewId: _id,images: req.uplodedFiles }
          const savedImages = await image.create(imageData) 
           reviewFound.images = savedImages.id;
           reviewFound.save();
      }
    }
  }
  if (!comment && !rating && !req.files) {
    return next(new ApiError(400, "found nothing to change"))
  }
  if (comment) {
    reviewFound.comment = comment;
  }
  if (rating) {
    reviewFound.rating = rating;
  }
  const data = await reviewFound.save();
  return res.status(201).json({
    statusCode: 201, message: "commented successfull !!", data
  })
}

exports.deleteReview = async (req, res, next) => {
  const _id = req.params.id;
  if (!ObjectId.isValid(_id)) {
    return next(new ApiError(409, "id is in wrong format"))
  }
  const reviewFound = await review.findOne({ _id });
  if (!reviewFound) {
    return next(new ApiError(400, "no review found"))
  }
  if(reviewFound.images){
      const imageData = await image.findOne({_id:reviewFound.images});
      await deletePhoto(req,next,imageData);
      imageData.remove();
  }
  await reviewFound.remove();
  await product.updateOne({ _id: reviewFound.productId }, { $pull: { reviews: _id } })
  return res.status(200).json({statusCode: 200, message: "review has been deleted" })
}
