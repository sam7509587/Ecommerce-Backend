const { validAddress } = require("../validations");
const { userPresent, addressPresent } = require("../utlilities");
const { userAddress } = require("../models");
const { ApiError } = require("../config");
const axios = require("axios").default;

exports.createAddress = async (req, res, next) => {
  const address = await addressPresent(req);
  if (address === null) {
    req.body.isDefault = true;
    req.body.userId = req.user.id;
    const data = await userAddress.create(req.body);
    return res.status(200).json({
      status: 200,
      message: "your data has been saved",
      success: true,
      data
    });
  } else {
    req.body.userId = req.user.id;
    const data = await userAddress.create(req.body);
    return res.status(200).json({
      status: 200,
      message: "your data has been saved",
      success: true, data
    });
  }
};
exports.editAddress = async (req, res, next) => {
  try {
    const _id = req.params.id
    if(Object.entries(req.body).length===0){
      return next(new ApiError(404,"nothing to change"))
    }
    const address = await userAddress.findOne({ _id })
    if (address === null)
      return next(new ApiError(404, "no address found "))

    if (req.body.isDefault == true) {
      const add = await userAddress.findOneAndUpdate(
        { userId: address.userId },
        { isDefault: false }
      );}
      const data = await userAddress.findOneAndUpdate({ _id }, req.body, { new: true });
      return res.status(200).json({
        status: 200,
        message: "your address has been updated",
        data,
        success: true,
      });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new ApiError(409, "check all ids may be format is wrong"))
    }
    return next(new ApiError(409, `err  : ${err}`))
  }

};

exports.deleteAddress = async (req, res,next) => {
  try{
  const _id= req.params.id
  const address = await addressPresent(req);
  if (!address){
    return next(new ApiError(404, "no address found "))
    }
  if (address.isDefault === true) {
    const userId = address.userId;
    await address.remove();
    const newAdd = await userAddress
      .findOne({ userId })
      .sort({ createdAt: -1 });

    if (!newAdd) {
      return res.status(200).json({
        status: 200,
        message: "your address has been deleted",
        success: true,
      });
    }else{
      newAdd.isDefault = true;
      newAdd.save()
    return res.status(200).json({
      status: 200,
      message: "your address has been deleted",
      success: true,
    });}
  }
  if (address.isDefault === false) {
    await userAddress.deleteOne({ _id });
    return res.status(200).json({
      status: 200,
      message: "your address has been deleted",
      success: true,
    });
  }
} catch (err) {
  if (err.name === "CastError") {
    return next(new ApiError(409, "check all ids may be format is wrong"))
  }
  return next(new ApiError(409, `err  : ${err}`))
}
};
exports.showAddress = async (req, res, next) => {
  try{
    const { page = 1, limit = 5 } = req.query;
  const address = await userAddress.find(
    { userId:req.user.id})  
    .limit(limit).skip((page - 1) * limit)
    .sort({ createdAt: -1 });;
  return res
    .status(200)
    .json({ status: 200, message: `addresses found`, address, success: true });
  }catch(err){
    if (user.name == "CastError") {
      return next(new ApiError(404, "invalid id format "))
    }else{
      return next(new ApiError(400,err.message))
    }
  }
};
// exports.showCountry = async (req, res, next) => {
//   try {
//     await axios
//       .get("https://countriesnow.space/api/v0.1/countries/states")
//       .then(function (response) {
//         if (!req.query.country && !req.query.state) {
//           return res.send(response.data)
//         }
//         const conuntryName = req.query.country
//         if (conuntryName) {
//           const obj = response.data
//           var result = Object.entries(obj);
//           var result1 = Object.keys(result).map((key) => [result[key]]);
//           const arr = result1[2][0][1]
//           const states = []
//           for (var i = 0; i < arr.length; i++) {
//             if (arr[i].name == req.query.country) {
//               states.push(arr[i].states)
//             }
//           }
//         }
//         if (!conuntryName) {
//           return res.send("wrong entry")
//         }
//         return res.send(response.data);
//       });
//   } catch (err) {
//     res.send(err);
//   }
// };

exports.getAddress=async(req,res,next)=>{
try{
  const data = await userAddress.findOne({_id:req.params.id})
  if(!data){
    return next(new ApiError(404,"no address found"))
  }
  else{
    res.status(200).json({success: true,status: 200,message: data})
  }
}catch(err){
  if (err.name == "CastError") {
    return next(new ApiError(404, "invalid id format "))
  }else{
    return next(new ApiError(400,err.message))
  }
}
}
