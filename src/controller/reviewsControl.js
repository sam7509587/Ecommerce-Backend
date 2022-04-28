const { ApiError } = require("../config");
const { product, order, review, image } = require("../models");
const { uploadPhoto, deletePhoto } = require("../utlilities");
const ObjectId = require('mongoose').Types.ObjectId;

exports.addReview = async (req, res, next) => {
  const { id: _id } = req.params;
  const { rating, comment } = req.body;
  if (!ObjectId.isValid(_id)) {
    return next(new ApiError(409, "id is in wrong format"))
  }
  const productFound = await product.findOne({ _id, isApproved: true }).populate("reviews","rating")
  if (!productFound) {
    return next(new ApiError(400, "no product found with this id"))
  }
  const orderFound = await order.findOne({ userId: req.user.id, "products.productId": _id, status: "delivered" });
  if (!orderFound) {
    return next(new ApiError(400, "only users who have bought the product can give reviews"))
  }
  const reviewFound = await review.count({ productId: _id, userId: req.user.id })
  if (reviewFound) {
    return next(new ApiError(400, "you have already commented on this prodcut"))
  }
  let imageData;
  if (req.files?.length > 0) {
    await uploadPhoto(req, next, "review")
    imageData = await image.create({
      images: req.uplodedFiles
    })
  }
  let data;
  if (imageData) {
    const newComment = new review({
      productId: _id,
      userId: req.user.id, comment, rating, images: imageData.id
    })
    data = await newComment.save()
    imageData.reviewId = data.id;
    await imageData.save();
  } else {
    const newComment = new review({
      productId: _id,
      userId: req.user.id, comment, rating, images: undefined
    })
    data = await newComment.save()
  }

  let totalRating = 0;
  productFound.reviews.map((obj)=>{
    totalRating +=obj.rating
  })
  const avgRating = (totalRating+data.rating)/(productFound.reviews.length+1)
   productFound.reviews.push(data.id)
   productFound.rating = avgRating
    await productFound.save();
  const dataFound = await review.findOne({ _id: data.id }).populate("images", "images.imageUrl")
  return res.status(201).json({
    statusCode: 201, message: "commented successfull !!", data: dataFound
  })
}

exports.editReview = async (req, res, next) => {
  const { id: _id } = req.params;
  const { rating, comment } = req.body;
  if (!ObjectId.isValid(_id)) {
    return next(new ApiError(409, "id is in wrong format"))
  }
  if (!comment && !rating && (req.files === undefined || req.files.length === 0)) {
    return next(new ApiError(400, "found nothing to change"))
  }
  const reviewFound = await review.findOne({ _id })
  if (!reviewFound) {
    return next(new ApiError(400, "no review found"))
  }
  if (req.files.length > 0) {
    await uploadPhoto(req, next, "review");
    if (reviewFound.images) {
      const imageData = await image.findOne({ reviewId: _id })
      await deletePhoto(req, next, imageData)
      imageData.images = req.uplodedFiles;
      imageData.save()
    }
    else {
      const imageData = { reviewId: _id, images: req.uplodedFiles }
      const savedImages = await image.create(imageData)
      reviewFound.images = savedImages.id;
    }
  }
  if (comment) {
    reviewFound.comment = comment;
  }
  if (rating) {
    reviewFound.rating = rating;
  }
   await reviewFound.save();
   const updatedReview = await review.findOne({ _id }).populate("images","images.imageUrl")
  return res.status(201).json({
    statusCode: 201, message: "commented successfull !!", updatedReview
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
  if (reviewFound.images) {
    const imageData = await image.findOne({ _id: reviewFound.images });
    await deletePhoto(req, next, imageData);
    imageData.remove();
  }
  await reviewFound.remove();
  const productFound =await product.findOne({ _id: reviewFound.productId}).populate("reviews","rating")
  let totalRating = 0;
  productFound.reviews.map((obj)=>{
    totalRating +=obj.rating
  })
  console.log(totalRating,reviewFound,productFound.reviews)
  const avgRating = (totalRating-reviewFound.rating)/(productFound.reviews.length-1)
  await product.updateOne({ _id: reviewFound.productId }, { rating :avgRating,$pull: { reviews: _id } })
  return res.status(200).json({ statusCode: 200, message: "review has been deleted" })
}

exports.getAllreviews = async(req,res,next)=>{
  const reviewFound = await review.find({userId: req.user.id});
  if(reviewFound.length === 0 ){
    return next(new ApiError(400,"user has not given any reviews "))
  }
 return res.status(200).json({statusCode :200,message: " reviews found",data: reviewFound})
}
exports.getReview = async(req,res,next)=>{
 try{ const {id:_id} = req.params;
  const reviewFound = await review.findOne({_id});
  if(!reviewFound){
    return next(new ApiError(400,"user has not given any reviews "))
  }
 return res.status(200).json({statusCode :200,message: " reviews found",data: reviewFound})
}catch(err){
  return next(new ApiError(409,err))
}
 
}
