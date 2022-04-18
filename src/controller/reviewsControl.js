const { ApiError } = require("../config");
const {product, order, review} = require("../models")
const ObjectId = require('mongoose').Types.ObjectId;

exports.addReview=async(req,res,next)=>{
    const _id = req.params.id;
    const {rating,comment}=req.body;
    if (!ObjectId.isValid(_id)) {
        return next(new ApiError(409, "id is in wrong format"))
    }
    const productFound = await product.findOne({_id,isActive:true})
    if(!productFound){
        return next(new ApiError(400,"no product found"))
    }
   const orderFound = await order.findOne({userId:req.user.id,productId:_id,status: "delivered"}) 
   if(!orderFound){
    return next(new ApiError(400,"only users who have bought the product can give reviews"))
   }
  const reviewFound = await review.findOne({productId:_id,userId:req.user.id})
//   let data;
  if(reviewFound){
//       reviewFound.comment = comment;
//       reviewFound.rating = rating;
//      data = await reviewFound.save();
    return next(new ApiError(400,"you have already commented on this prodcut"))
  }
// else{
       newComment = new review({
          productId:_id,userId : req.user.id,comment,rating
      })
      const data =await newComment.save()
       productFound.reviews.push(data.id)
       await productFound.save();
//   }
  res.status(201).json({
      success : true, sattus :201,message : "commented successfull !!" , data
  })
}

exports.editReview=async(req,res,next)=>{
    const _id = req.params.id;
    const {rating,comment}=req.body;
    if (!ObjectId.isValid(_id)) {
        return next(new ApiError(409, "id is in wrong format"))
    }
    const reviewFound = await review.findOne({_id,isActive:true})
    if(!reviewFound){
        return next(new ApiError(400,"no review found"))
    }
  if(!comment && !rating){
    return next(new ApiError(400,"found nothing to change"))
  }
  if(comment){
      reviewFound.comment = comment;
  }
  if(rating){
      reviewFound.rating = rating;
  }
    const data = await reviewFound.save();
  res.status(201).json({
      success : true, sattus :201,message : "commented successfull !!" , data
  })
}

exports.deleteReview=async(req,res,next)=>{
    const _id = req.params.id;
    if (!ObjectId.isValid(_id)) {
        return next(new ApiError(409, "id is in wrong format"))
    }
    const reviewFound = await review.findOne({_id});
    if(!reviewFound){
        return next(new ApiError(400, "no review found"))
    }
    await reviewFound.remove();
    await product.updateOne({_id:reviewFound.productId},{$pull:{reviews:_id}})
    res.status(200).json({success: true,status : 200,message: "review has been deleted"})
}
