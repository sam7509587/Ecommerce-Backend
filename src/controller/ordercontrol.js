const { ApiError, createPdf, deliveryStatus, ADMIN } = require("../config");
const { product, order, User, address, cart } = require("../models");
const { saveOrder } = require("../services");
const ObjectId = require('mongoose').Types.ObjectId;

exports.placeOrder = async (req, res, next) => {
    try {
        const { products, addressId } = req.body;
        let amount = 0;
        let productFound;
        let deliveryCharges = 0;
        for (i of products) {
            let _id = i.productId;
            let quantity = i.quantity;
            productFound = await product.findOne({ _id, isApproved: true });
            if (!productFound) {
                return next(new ApiError(400, `no product found with the id ${_id} `))
            }
            if (quantity > productFound.quantity) {
                return next(new ApiError(406, `We're sorry! Only ${productFound.quantity} unit(s) available in stock`))
            }
            i.price = productFound.price * quantity;
            amount += i.price
            productFound.quantity -= quantity;
            await productFound.save()
            const cartItems = await cart.updateOne({ userId: req.user.id }, {
                $pull: { products: { productId: _id } },
            });
        }
        const totalPrice = (amount > 500 ? amount : amount + 40)
        req.body.totalPrice = totalPrice;
        deliveryCharges = (amount > 500 ? 0 : 40)
        const defaultAddress = await address.findOne({ userId: req.user.id, isDefault: true })
        if (!defaultAddress && !addressId) {
            return next(new ApiError(400, "no default address found please provide addressId"))
        }
        const orederSaved = await saveOrder(req)
        const pdfData = await order.findOne({ _id: orederSaved }).populate("products.productId").populate("addressId")
        //     .populate("userId")

        //   await createPdf(pdfData)

        return res.status(201).json({
            statusCode: 200,
            message: "order placed",
            totalPrice,
            deliveryCharges,
            data: orederSaved
        })
    }
    catch (err) {
        console.log(err)
        return next(new ApiError(400, err.message))
    }
}
exports.getAllOrders = async (req, res, next) => {
    const { page = 1, limit = 5, search } = req.query;
    let query;
    if (!search) {
        query = { userId: req.user.id }
    } else {
        query = Object.assign({ userId: req.user.id }, { $or: [{ "products.productName": new RegExp(search) }] })
    }
    const data = await order.find(query)
        .populate("products.productId", "price productName").populate("addressId")

    return res.status(200).json({
        statusCode: 200, message: "data found",
        // totalPrice: `total price ->${deliveryCharges} delivery charges included:${price} `,
        data
    })
}
exports.getOrder = async (req, res, next) => {
    const _id = req.params.id
    if (!ObjectId.isValid(_id)) {
        return next(new ApiError(409, "id is in wrong format"))
    }
    const data = await order.findOne({ _id })
        .populate("products.productId", "price").populate("addressId")

    let totalPrice = data.products.reduce((acc, i) => {
        return acc + i.productId.price;
    }, 0);
    const amount = (totalPrice > 500 ? `total price : ${totalPrice}` :
        `total price-40rs delivey charges included : ${totalPrice + 40}`)
    return res.status(200).json({
        statusCode: 200, message: "data found",
        amount,
        data
    })
}
exports.cancelOrder = async (req, res, next) => {
    try {
        const _id = req.params.id
        if (!ObjectId.isValid(_id)) {
            return next(new ApiError(409, "id is in wrong format"))
        }
        const data = await order.findOne({ _id, userId: req.user.id })
        if (!data) {
            return next(new ApiError(400, "no order found with this id"));
        }
        if (data.status === "canceled") {
            return next(new ApiError(400, "already cancelled"))
        }
        if (!["ordered", "packed"].includes(data.status)) {
            return next(new ApiError(400, "you can't cancel order now."))
        }
        data.status = "canceled"
        data.save();
        for (i of data.products) {
            const productFound = await product.findOne({ id: i.id })
            productFound.quantity += i.quantity;
            productFound.save();
        }
        return res.status(200).json({
            statusCode: 200, message: "order cancels"
        })
    }
    catch (err) {
        return next(new ApiError(400, err.message))
    }
};
exports.changeStatus = async (req, res, next) => {
    try {
        const _id = req.params.id
        const { status } = req.body;
        if (!ObjectId.isValid(_id)) {
            return next(new ApiError(409, "id is in wrong format"))
        }
        if (!status) {
            return next(new ApiError(409, "status is required"))
        }
        const data = await order.findOne({ _id })
        if (!data) {
            return next(new ApiError(400, "no order found"))
        }
        if (!deliveryStatus.includes(status)) {
            return next(new ApiError(409, "status can have only `packed`, `shipped`, `delivered` values "))
        }
        if (deliveryStatus.indexOf(status) < deliveryStatus.indexOf(data.status)) {
            return next(new ApiError(409, `you cant set status ${status} after ${data.status}`))
        }
        if (!data) {
            return next(new ApiError(400, "no order found with this id"));
        }
        if (data.status === status) {
            return next(new ApiError(400, `order status has already ${status} value`));
        }
        if (status === "delivered") {
            if (req.user.role != ADMIN) {
                return next(new ApiError(401, "only admin can change status to delivered"))
            }
            data.status = status;
        data.save();
        return res.status(200).json({
            statusCode: 200, message: `order status has been changed `, data
        })
        }
        data.status = status;
        data.save();
        return res.status(200).json({
            statusCode: 200, message: `order status has been changed `, data
        })
    } catch (err) {
        return next(new ApiError(400, err.message))
    }
}
exports.fetchDates = async (req, res, next) => {
    const { deliveryMode } = req.query
    if (!deliveryMode) {
        return next(new ApiError(400, "deliveryMode not found in query"));
    }
    if (deliveryMode == "standard") {
        const range = Math.floor(Math.random() * (6 - 3) + 3);
        deliveryTime = new Date(+new Date() + range * 24 * 60 * 60 * 1000)
        return res.status(200).json({
            statusCode: 200,
            message: "date found ",
            data: deliveryTime
        })
    }
    if (deliveryMode == "fast") {
        deliveryTime = new Date(+new Date() + 1 * 24 * 60 * 60 * 1000)
        return res.status(200).json({
            statusCode: 200,
            message: "date found ",
            data: deliveryTime
        })
    }
    next(new ApiError(409, "deliveryMode can have only standard or fast values"))

}
