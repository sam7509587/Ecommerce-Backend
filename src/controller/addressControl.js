const { validAddress } = require("../validations");
const { userPresent, addressPresent } = require("../utlilities");
const { userAddress } = require("../models");
const { ApiError } = require("../config");
const axios = require("axios").default;
exports.createAddress = async (req, res, next) => {
  const validAdd = await validAddress(req);
  if (validAdd.error) {
    return next(new ApiError(422,validAdd.error.details[0].message))
  }
  const checkUser = await userPresent(req);
  if (checkUser === null) {
    return next(new ApiError(401,"please enter registerd number"))
  }
  const address = await addressPresent(req);
  if (address === null) {
    req.body.isDefault = true;
    req.body.userId = checkUser.id;
    await userAddress.create(req.body);
    return res.status(200).json({
      status: 200,
      message: "your data has been saved",
      success: true,
    });
  } else {
    req.body.userId = checkUser.id;
    await userAddress.create(req.body);
    return res.status(200).json({
      status: 200,
      message: "your data has been saved",
      success: true,
    });
  }
};
exports.editAddress = async (req, res,next) => {
  const _id = req.query.id;
  if (!_id || _id === undefined)
  return next(new ApiError(400,"please enter valid id"))

  if (req.body.phoneNumber) {
    return next(new ApiError(400,"You can't numdate your phone number right now"))
  }
  const address = await addressPresent(req);
  if (address === null)
  return next(new ApiError(404,"no address found "))
   
  if (req.body.isDefault == true) {
    const add = await userAddress.updateMany(
      { userId: address.userId },
      { isDefault: false }
    );
    const data = await userAddress.updateOne({ _id }, req.body, { new: true });
    return res.status(200).json({
      status: 200,
      message: "your address has been updated",
      data,
      success: true,
    });
  }
  const data = await userAddress.updateOne({ _id }, req.body, { new: true });
  return res.status(200).json({
    status: 200,
    message: "your address has been updated",
    data,
    success: true,
  });
};

exports.deleteAddress = async (req, res) => {
  const _id = req.query.id;
  if (!_id || _id === undefined)
  return next(new ApiError(400,"please enter valid id"))

  const address = await addressPresent(req);
  if (address === null)
  return next(new ApiError(404,"no address found "))

  if (address.isDefault === true) {
    const userId = address.userId;
    await userAddress.deleteOne({ _id });
    const newAdd = await userAddress
      .findOne({ userId })
      .sort({ createdAt: -1 });
      
    if (!newAdd) {
      return res.status(200).json({
        status: 200,
        message: "your address has been deleted",
        success: true,
      });
    }
    await userAddress.updateOne({ _id: newAdd.id }, { isDefault: true });
    return res.status(200).json({
      status: 200,
      message: "your address has been deleted",
      success: true,
    });
  }
  if (address.isDefault === false) {
    await userAddress.deleteOne({ _id });
    return res.status(200).json({
      status: 200,
      message: "your address has been deleted",
      success: true,
    });
  }
};
exports.showAddress = async (req, res, next) => {
  const _id = req.query.id;
  if (!_id || _id === undefined)
  return next(new ApiError(400,"please enter valid id"))
  if (user === null) {
    return next(new ApiError(400,"no user found"))
  }
  if (user.name == "CastError") {
    return next(new ApiError(404,"invalid id format "))
  }
  const address = await userAddress.find(
    { sellerId: user.id },
    { _id: 0, fullName: 0, userId: 0, createdAt: 0, isActive: 0 }
  );
  return res
    .status(200)
    .json({ status: 200, message: `addresses found`, address, success: true });
};
exports.showCountry = async (req, res, next) => {
  try {
    await axios
      .get("https://countriesnow.space/api/v0.1/countries/states")
      .then(function (response) {
        if(!req.query.country && !req.query.state ){
        return res.send(response.data)}
        const conuntryName = req.query.country
        if(conuntryName){
            const obj =response.data
            var result = Object.entries(obj);
            var result1 = Object.keys(result).map((key) => [ result[key]]);
            const arr =  result1[2][0][1]
            const states = []
            for(var i = 0; i < arr.length; i++) {
                if (arr[i].name == req.query.country) {
                    states.push(arr[i].states)
                }
            }}
            if(!conuntryName){
            return res.send("wrong entry")}
        return res.send(response.data);
      });
  } catch (err) {
    res.send(err);
  }
};
