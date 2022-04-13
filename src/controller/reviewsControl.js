const { ApiError } = require("../config");
const {product} = require("../models")
exports.addReview=async(req,res,next)=>{
    const {productId} = req.params.id;
    const {rating,comment}=req.body;
    const canComment = await product.findOne({id:productId,isActive:true})
    if(!canComment){
        return next(new ApiError(404,"no product found"))
    }
    console.log(req.user.boughtProducts.includes(productId))
}
