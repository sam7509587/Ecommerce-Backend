// const { client } = require("../config")

const async = require("hbs/lib/async");
const { ApiError } = require("../config");
const { product, cart } = require("../models")

exports.addToCart = async (req, res, next) => {
    try {
        const { quantity = 1, productId } = req.body
        const productPresent = await product.findOne({ _id: productId, isActive: true });
        if (!productPresent) {
            return next(new ApiError("no product found with the id "))
        }
        if (quantity > productPresent.quantity) {
            return next(new ApiError(406, `We're sorry! Only ${productPresent.quantity} unit(s) allowed in each order`))
        }
        const addedCart = await cart.findOne({ productId, userId: req.user.id })
        if (addedCart) {
            addedCart.quantity += 1;
            if (addedCart.quantity > productPresent.quantity) {
                return next(new ApiError(406, `We're sorry! Only ${productPresent.quantity} unit(s) allowed in each order`))
            } else {
                const data = await addedCart.save();
                res.status(201).json({ success: true, status: 201, message: "added successfull", data })
            }
        } else {
            const cartData = {
                productId, quantity, userId: req.user.id
            }
            const data = await cart.create(cartData);
            return res.status(201).json({ success: true, status: 201, message: "added successfull", data })
        }
    } catch (err) {
        if (err.name === "CastError") {
            return next(new ApiError(409, "productId is not in correct format"))
        }
        else {
            return next(new ApiError(400, err.message))
        }
    }
}
exports.deleteFromCart = async (req, res, next) => {
    const _id = req.params.id;
    try {
        const addedCart = await cart.findOne({ _id })
        if (!addedCart) {
            return next(new ApiError(404, "no cart data found"))
        }
        addedCart.remove()
        res.status(200).json({ success: true, status: 200, message: "data deleted successfull" })
    } catch (err) {
        if (err.name === "CastError") {
            return next(new ApiError(409, "productId is not in correct format"))
        }
        else {
            return next(new ApiError(400, err.message))
        }
    }
}


exports.incrementDecrement = async(req, res, next) => {
    try {    const _id = req.params.id;
        const {value}= req.query
        const addedCart = await cart.findOne({ _id })
        if (!addedCart) {
            return next(new ApiError(404, "no cart data found"))
        }
        const productPresent = await product.findOne({_id: addedCart.productId, isActive: true });
        if(value==="increment"){
            addedCart.quantity+=1;
            if (addedCart.quantity > productPresent.quantity) {
                return next(new ApiError(406, `We're sorry! Only ${productPresent.quantity} unit(s) allowed in each order`))
            } else {
                const data = await addedCart.save();
                res.status(201).json({ success: true, status: 201, message: "increment successfull", data })
            }
        }
        if(value==="decrement"){
            addedCart.quantity-=1;
            if (addedCart.quantity ==0) {
                return next(new ApiError(406, `quantity can not be less than zero`))
            } else {
                const data = await addedCart.save();
                res.status(201).json({ success: true, status: 201, message: "decrement successfull", data })
            }
        }
    } catch (err) {
        if (err.name === "CastError") {
            return next(new ApiError(409, "productId is not in correct format"))
        } else {
            return next(new ApiError(400, err.message))
        }
    }
}


exports.showCart=async(req,res,next)=>{
const allCart = await cart.find({userId:req.user.id}).populate("productId","price")
let price = 0;
for (i of allCart){
    value = (i.quantity*i.productId.price)
    price += value
}
res.json({
    success:true,
    status: 200,
    message: "data found",
    price:`total price for ${allCart.length} items : ${price}`,
    data:allCart
})
}
