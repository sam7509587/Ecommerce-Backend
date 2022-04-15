const async = require("hbs/lib/async");
const { ApiError } = require("../config");
const { brand, image } = require("../models");
const { uploadPhoto, deletePhoto } = require("../utlilities");

exports.addBrand = async (req, res, next) => {
    const { brandName } = req.body;
    if (!brandName)
        return next(new ApiError(404, "brandName is required"))
    const namePresent = await brand.findOne({ brandName: brandName })
    if (namePresent) {
        return next(new ApiError(409, "brand name already present"))
    }
    if (req.files) {
        if (req.files.length >= 2) {
            return next(new ApiError(409, "you can upload only 1 file"))
        }
        if (req.files.length > 0) {
            await uploadPhoto(req, next, "brands")
            imageData = { images: req.uplodedFiles }
            const savedImages = await image.create(imageData)
            req.imageSaved = savedImages
        }
    }
    if (req.body) {
        if (!req.imageSaved) {
            const data = await brand.create(req.body)
            return res.status(201).json({ status: 201, message: "brand created successfully", success: true,data })
        } else {
            req.body.image = req.imageSaved.id;
            const newBrand = await brand.create(req.body)
            req.imageSaved.brandId = newBrand.id
            await req.imageSaved.save()
            const data = await brand.findOne({ _id: newBrand.id })
                .populate("image", "images.imageUrl")
            return res.status(201).json({ status: 201, message: "brand created successfully", success: true,data })
        }
    }
}


exports.showBrand = async (req, res, next) => {
    const _id = req.params.id;
    
    try {
        const brands = await brand.find({ _id, isActive: true }).populate("image", "images.imageUrl")
        if (brands.length == 0) {
            return next(new ApiError(404, "no product found;"))
        }
        res.status(200).json({
            status: 200,
            message: "brand founds",
            success: true,
            data: brands
        })
    } catch (err) {
        next(new ApiError(400, err.message))
    }
}
exports.deleteBrand = async (req, res, next) => {
    try {
        const id = req.params.id;
        const brandPresent = await brand.findOne({ _id: id, isActive: true }).populate("image", "image.imageUrl")
        if (!brandPresent) {
            return next(new ApiError(404, "no brand found"))
        }
        if (brandPresent.image) {
            const imageData = await image.findOne({ brandId: req.params.id })
            await deletePhoto(req, next, imageData)
            imageData.remove();
            brandPresent.isActive = false;
            brandPresent.image = undefined
            brandPresent.save()
        } else {
            brandPresent.isActive = false;
            brandPresent.save()
        }
        return res.status(200).json({
            status: 200,
            message: "deleted successfull !!",
            success: true, data: brandPresent
        })
    } catch (err) {
        if (err.name === "CastError") {
            return next(new ApiError(409, "id format is wrong"))
        }
        return next(new ApiError(409, `err  : ${err}`))
    }
}
exports.showAllBrands = async (req, res, next) => {
    const { page = 1, limit = 5 } = req.query;
    const brands = await brand.find(Object.assign({ isActive: true ,$or:[{"brandName":new RegExp(req.query.search)}]})).limit(limit).skip((page - 1) * limit).sort({ createdAt: -1 });
    if (!brands) {
        return next(new ApiError(404, "no brands found"));
    }
    res.status(200).json({ status: 200, message: `brands found - ${brands.length}`, success: true,data:brands })
}
exports.editBrands = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const namePresent = await brand.findOne({ _id, isActive: true })
        if (!namePresent) {
            return next(new ApiError(409, "no brand found with this id"))
        }
        if (namePresent.brandName === req.body.brandName) {
            return next(new ApiError(409, "can't use the privious brand name ; enter new brandName"))
        }
        if(req.body || req.files){
            if((Object.keys(req.body).length<=1)&&(req.files==undefined)){
                return next(new ApiError(404," nothing to change"))
            }
        }
        req.brand = namePresent;
        if(req.files){
            if (req.files.length > 0) {
                if (!req.brand.image) {
                  await uploadPhoto(req, next, "brands")
                  const imageData = { brandId: req.brand.id, images:req.uplodedFiles }
                  const savedImages = await image.create(imageData)
                  req.body.image = savedImages.id
                }
                else {
                  const imagesData = await image.findOne({ id: req.brand.image })
                  await deletePhoto(req, next, imagesData)
                  await uploadPhoto(req, next, "brands")
                  const imageData = { images: req.uplodedFiles }
                  const savedImages = await image.findOneAndUpdate({ brandId: req.brand.id }, imageData, { new: true })
                }
              }
        }  
        if (req.body) {
        if(Object.keys(req.body).length>=1){
            const updated = await brand.findOneAndUpdate({ id:req.brand .id }, req.body, { new: true })
              .populate("image", "images.imageUrl")
            return res.status(201).json({ status: 201, message: "brand updated successfully", data:updated, success: true, })
        }
          else{
           const updated =  req.brand.populate("image", "images.imageUrl")
            return res.status(201).json({ status: 201, message: "brand's image updated successfully", success: true,data:updated })
          }}
    } catch (err) {
        if (err.name === "CastError") {
            return next(new ApiError(409, "check all ids may be format is wrong"))
        }
        return next(new ApiError(409, `err  : ${err}`))
    }
}
