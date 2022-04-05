const { USER } = require('../config');
const cloudinary = require("cloudinary")
const multer  = require('multer')
const upload = multer({ dest:__dirname+"../uploads"})

exports.UserData = (req) => {
  req.body.isApproved = true;
  req.body.role = USER;
  return req.body;
};

