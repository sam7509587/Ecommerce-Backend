const { ApiError } = require("../config");
const { product, cart } = require("../models");
const objectId = require("mongoose").Types.ObjectId;
exports.
    addToCart = async (req, res, next) => {
        try {
            const cartFound = await cart.findOne({ userId: req.user.id })
            let createCart
            const { products } = req.body;
            let productFound;
            for (i of products){
                let _id = i.productId;
                let quantity = i.quantity;
                let productInCart = cartFound?.products.find((item)=> {
                    let itemId = item.productId.toString().replace(/ObjectId\("(.*)"\)/, "$1")
                   return itemId === _id})
                productFound = await product.findOne({ _id, isApproved: true });
                if (!productFound) {
                    return next(new ApiError(400, `no product found with the id ${_id} `))
                }
                if (quantity > productFound.quantity) {
                    return next(new ApiError(406, `We're sorry! Only ${productFound.quantity} unit(s) available in stock`))
                }}
                if (cartFound) {
                    for (i of products) {
                        cartFound.products.push(i)
                    };
                    createCart = await cartFound.save();
                } else {
                    addCart = new cart({
                        products, userId: req.user.id
                    })
                    createCart = await addCart.save();
                }
            return res.status(201).json({
                statusCode: 200,
                message: "added to cart successfully",
                data: createCart
            })
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
    if (!objectId.isValid(_id)) {
        return next(new ApiError(409, "invalid id format"))
    }
    const addedCart = await cart.findOne({ userId: req.user.id});
    if (!addedCart) {
        return next(new ApiError(400, "there is no cart of this user"));
    }
    const found = addedCart.products.find(element => element.id === _id);
    if (!found) {
        return next(new ApiError(400, "no cart details found with this id"))
    }
    const data = await cart.findOneAndUpdate({ userId: req.user.id }, { $pull: { products: { _id } } }, { new: true })
    return res.status(200).json({ statusCode: 200, message: "data removed successfull", data })
}
exports.incrementDecrement = async (req, res, next) => {
    try {
        const {id :_id} = req.params;
        const { value } = req.query
        const addedCart = await cart.findOne({ userId: req.user.id })
        if (!addedCart) {
            return next(new ApiError(404, "no cart data found"))
        }
        const found = addedCart.products.find(element => element.id === _id);
        if (!found) {
            return next(new ApiError(400, "no cart details found with this id"))
        }
        let quantity = found.quantity
        const productPresent = await product.findOne({ _id: found.productId });
        if (!productPresent) {
            return next(new ApiError(400, "no product found in this cart object"))
        }
        if (value === "increment") {
            quantity += 1;
            if (quantity > productPresent.quantity) {
                return next(new ApiError(406, `We're sorry! Only ${productPresent.quantity} unit(s) allowed in each order`))
            } else {
                const data = await cart.findOneAndUpdate({ userId: req.user.id, 'products._id': _id }, {
                    '$set': {
                        'products.$.quantity': quantity,
                    }
                },{new:true})
                return res.status(201).json({ statusCode: 201, message: "increment successfull", data })
            }
        }
        if (value === "decrement") {
            quantity -= 1;
            if (quantity == 0) {
                return next(new ApiError(406, `quantity can not be less than zero`))
            } else {
                const data = await cart.findOneAndUpdate({ userId: req.user.id, 'products._id': _id }, {
                    '$set': {
                        'products.$.quantity': quantity,
                    }
                })
                return res.status(201).json({ statusCode: 201, message: "decrement successfull", data },{new:true})
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
exports.showCart = async (req, res, next) => {
    const { page = 1, limit = 5 } = req.query;
    const allCart = await cart.findOne({ userId: req.user.id }).populate("products.productId","price")
    .limit(limit).skip((page - 1) * limit).sort({ createdBy: -1 })
    let price = 0;
    for (i of allCart.products) {
        value = (i.quantity * i.productId.price)
        price += value
    }
  const totalPrice =`total price for ${allCart.length} orders : ${price}`
    res.json({
        statusCode: 200,
        message: "data found",
        totalPrice,
        data: allCart
    })
}
exports.clearCart = async (req, res, next) => {
    const cartData = await cart.findOne({ userId: req.user.id });
    if (!cartData) {
        return next(new ApiError(404, "no data found to delete"))
    }
    await cart.updateOne({ userId: req.user.id},{products:[]})
    // await cartData.remove();
    return res.status(200).json({ statusCode: 200, message: "data has been deleted" })
}
