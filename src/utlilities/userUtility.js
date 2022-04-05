const { USER } = require('../config');
const cloudinary = require("cloudinary")

exports.UserData = (req) => {
  req.body.isApproved = true;
  req.body.role = USER;
  return req.body;
};

