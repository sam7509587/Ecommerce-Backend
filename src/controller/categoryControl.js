
const { ApiError } = require("../config");
const { category, image } = require("../models");
const { uploadPhoto } = require("../utlilities");

exports.addCategory = async (req, res, next) => {
    const { categoryName } = req.body;
    if (!categoryName)
        return next(new ApiError(404, "categoryName is required"))
    const namePresent = await category.findOne({ categoryName })
    if (namePresent) {
        return next(new ApiError(409, "categoryName already present"))
    }
    if (req.files) {
        if (req.files.length >= 2) {
            return next(new ApiError(409, "you can upload only 1 file"))
        }
        if (req.files.length > 0) {
            await uploadPhoto(req, next, "categories")
            imageData = { images: req.uplodedFiles }
            const savedImages = await image.create(imageData)
            req.imageSaved = savedImages
        }
    }
    if (req.body) {
        if (!req.imageSaved) {
            const data = await category.create(req.body)
            return res.status(201).json({ statusCode: 201, message: "category created successfully", data })
        } else {
            req.body.image = req.imageSaved.id;
            const newCategory = await category.create(req.body)
            req.imageSaved.categoryId = newCategory.id
            await req.imageSaved.save()
            const data = await category.findOne({ _id: newCategory.id })
                .populate("image", "images.imageUrl")
            return res.status(201).json({ statusCode: 201, message: "category created successfully", data })
        }
    } 
}

exports.showCategory = async (req, res, next) => {
    const _id = req.params.id;
    try {
        const categorys = await category.find({ _id, isActive: true })
        if (categorys.length == 0) {
            return next(new ApiError(404, "no product found;"))
        }
        return res.status(200).json({
            statusCode: 200,
            message: "category founds",
            data:categorys,
        })
    } catch (err) {
        next(new ApiError(400, err.message))
    }
}
exports.deleteCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const categoryPresent = await category.findOne({ _id: id, isActive: true }).populate("image", "image.imageUrl")
        if (!categoryPresent) {
            return next(new ApiError(404, "no category found"))
        }
        if (categoryPresent.image) {
            const imageData = await image.findOne({ categoryId: req.params.id })
            await deletePhoto(req, next, imageData)
            imageData.remove();
            categoryPresent.isActive = false;
            categoryPresent.image = undefined
            categoryPresent.save()
        } else {
            categoryPresent.isActive = false;
            categoryPresent.save()
        }
        return res.status(200).json({
            statusCode: 200,
            message: "deleted successfull !!",
             data: categoryPresent
        })
    } catch (err) {
        if (err.name === "CastError") {
            return next(new ApiError(409, "id format is wrong"))
        }
        return next(new ApiError(409, `err  : ${err}`))
    }
}
exports.showAllCategorys = async (req, res, next) => {
    const { page = 1, limit = 5 } = req.query;
    const categorys = await category.find({ isActive: true, $or:[{"categoryName":new RegExp(req.query.search)}] })
    .limit(limit).skip((page - 1) * limit)
    .sort({ createdAt: -1 });
    if (!categorys) {
        return next(new ApiError(404, "no categorys found"));
    }
    return res.status(200).json({ statusCode: 200, message: `categorys found `, data  :categorys })
}
exports.editCategorys = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const namePresent = await category.findOne({ _id, isActive: true })
        if (!namePresent) {
            return next(new ApiError(409, "no category found with this id"))
        }
        if (namePresent.categoryName === req.body.categoryName) {
            return next(new ApiError(409, "can't use the privious category name ; enter new categoryName"))
        }
        if (req.body || req.files) {
            if ((Object.keys(req.body).length <= 1) && (req.files == undefined)) {
                return next(new ApiError(404, " nothing to change"))
            }
        }
        req.categoryName = namePresent;
        if (req.files) {
            if (req.files.length > 0) {
                if (!req.categoryName.image) {
                    await uploadPhoto(req, next, "categories")
                    const imageData = { categoryId: req.categoryName.id, images: req.uplodedFiles }
                    const savedImages = await image.create(imageData)
                    req.body.image = savedImages.id
                }
                else {
                    const imagesData = await image.findOne({ id: req.categoryName.image })
                    await deletePhoto(req, next, imagesData)
                    await uploadPhoto(req, next, "categories")
                    const imageData = { images: req.uplodedFiles }
                    const savedImages = await image.findOneAndUpdate({ categoryId: req.categoryName.id }, imageData, { new: true })
                }
            }
        }
        if (req.body) {
            if (Object.keys(req.body).length >= 1) {
                const updated = await category.findOneAndUpdate({ id: req.categoryName.id }, req.body, { new: true })
                    .populate("image", "images.imageUrl")
                return res.status(201).json({ statusCode: 201, message: "category updated successfully", data: updated})
            }
            else {
                const updated = req.categoryName.populate("image", "images.imageUrl")
                return res.status(201).json({ statusCode: 201, message: "category's image updated successfully", data: updated })
            }
        }
    } catch (err) {
        if (err.name === "CastError") {
            return next(new ApiError(409, "check all ids may be format is wrong"))
        }
        return next(new ApiError(409, `err  : ${err}`))
    }
}

