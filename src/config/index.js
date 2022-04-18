const { errorHandler, environment, inBulid } = require('./error_handle');
require('dotenv').config();
const { swaggerOptions } = require("./swagger")
const {timeOut,otherRoute}=require("./routeERROR")
const {upload} =require("./multer")
module.exports = {
  PORT: environment("PORT"),
  connectDb: require('./connectdb'),
  DBURI: environment("DBURI"),
  ENCODED_DATA: environment("ENCODED_DATA"),
  SECRET_KEY: environment("SECRET_KEY"),
  TWILIO_SID: environment("TWILIO_SID"),
  TWILIO_TOKEN: environment("TWILIO_TOKEN"),
  PHONE: environment("PHONE"),
  EN_TYPE: environment("EN_TYPE"),
  USER_MAIL: environment("USER_MAIL"),
  USER_PASSWORD: environment("USER_PASSWORD"),
  ADMIN:"admin",
  SELLER:"seller",
  USER:"user",
  ApiError: require('./apierror'),
  errorHandler,
  environment,
  inBulid, swaggerOptions,
  cloudinary: require("./cloudinary"),
  CLOUD_NAME: environment("CLOUD_NAME"),
  API_KEY: environment("API_KEY"),
  API_SECRET: environment("API_SECRET"),
  upload,timeOut,otherRoute
};
