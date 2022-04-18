const { ApiError } = require("../config");
const { product, order, User, address } = require("../models");
const ObjectId = require('mongoose').Types.ObjectId;
exports.placeOrder = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const { quantity, addressId } = req.body
        if (!ObjectId.isValid(_id)) {
            return next(new ApiError(409, "id is in wrong format"))
        }
        if (addressId) {
            if (!ObjectId.isValid(addressId)) {
                return next(new ApiError(409, "address id is in wrong format"))
            }
        }
        if (!quantity) {
            return next(new ApiError(400, `quantity is required to place order`))
        }
        const productFound = await product.findOne({ _id, isActive: true });
        if (!productFound) {
            return next(new ApiError("no product found with the id "))
        }
        if (quantity > productFound.quantity) {
            return next(new ApiError(406, `We're sorry! Only ${productFound.quantity} unit(s) allowed in each order`))
        }
        const defaultAddress = await address.findOne({ userId: req.user.id, isDefault: true })
        const addressFound = await address.findOne({ userId: req.user.id, _id: addressId })
        if (!defaultAddress && !addressId) {
            return next(new ApiError(400, "no default address found please provide addressId"))
        }
        let data;

        if (!addressId) {
            const newOrder = new order({
                userId: req.user.id,
                productId: _id,
                quantity, address: defaultAddress.id
            })
            data = await newOrder.save()
        } else {
            const newOrder = new order({
                userId: req.user.id,
                productId: _id,
                quantity, address: addressId
            })
            data = await newOrder.save()
        }
        productFound.quantity -= quantity;
        productFound.save()
        await User.findOneAndUpdate({ _id: req.user.id }, { $push: { orders: data.id } })
        res.status(201).json({
            success: true,
            status: 200,
            message: "order placed",
            data
        })
    }
    catch (err) {
        return next(new ApiError(400, err.message))
    }
}
exports.getAllOrders = async (req, res, next) => {
    const data = await order.find({ userId: req.user.id }).populate("productId","price").populate("address")
   const price = data.reduce((acc,items)=>{
       return acc+=items.quantity*items.productId.price
   },0);
    res.status(200).json({
        success: true,
        status: 200, message: "data found",
        totalPrice:price,
        data
    })
}
exports.getOrder = async (req, res, next) => {
    const _id = req.params.id
    if (!ObjectId.isValid(_id)) {
        return next(new ApiError(409, "id is in wrong format"))
    }
    const data = await order.findOne({ _id }).populate("productId","price").populate("address")
    res.status(200).json({
        success: true,
        status: 200, message: "data found",
        totalPrice:data.quantity*data.productId.price ,
        data
    })
}
exports.cancelOrder = async (req, res, next) => {
    try {
        const _id = req.params.id
        if (!ObjectId.isValid(_id)) {
            return next(new ApiError(409, "id is in wrong format"))
        }
        const data = await order.findOne({ _id, userId: [req.user.id] })
        if (!data) {
            return next(new ApiError(400, "no order found with this id"));
        }
        if (data.status === "cancelled") {
            return next(new ApiError(400, "already cancelled"))
        }
        data.status = "cancelled"
        data.save();
        const productFound = await product.findOne({ _id: data.productId })
        productFound.quantity += data.quantity;
        productFound.save();
        await User.updateOne({ _id: req.user.id }, { $pull: { orders: _id } })
        return res.status(200).json({
            success: true,
            status: 200, message: "order cancels"
        })
    }
    catch (err) {
        return next(new ApiError(400, err.message))
    }
}
exports.changeStatus = async (req, res, next) => {
    try {
        const _id = req.params.id
        const {status} = req.body;
        if (!status) {
            return next(new ApiError(409, "status is required"))
        }
        if (!["shipped", "delivered"].includes(status)) {
            return next(new ApiError(409, "status can have only  'shipped','delivered' values "))
        }
        if (!ObjectId.isValid(_id)) {
            return next(new ApiError(409, "id is in wrong format"))
        }
        const data = await order.findOne({ _id })
        if (!data) {
            return next(new ApiError(400, "no order found with this id"));
        }
        if (data.status === status) {
            return next(new ApiError(400, `order status has already ${status} value`));
        }
        if(status==="delivered"){
            data.deliveryTime = undefined
        }
        data.status = status;
        data.save();
        res.status(200).json({
            success: true, status: 200, message: `order status has been changed `, data
        })
    } catch (err) {
        return next(new ApiError(400, err.message))
    }
}
