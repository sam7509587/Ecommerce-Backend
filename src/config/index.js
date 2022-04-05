const { errorHandler, environment, inBulid } = require('./error_handle');
require('dotenv').config();
const connectDb = require('./connectdb');
const PORT = environment("PORT");
const DBURI = environment("DBURI");
const ENCODED_DATA = environment("ENCODED_DATA");
const SECRET_KEY = environment("SECRET_KEY") ;
const TWILIO_SID = environment("TWILIO_SID") ;
const TWILIO_TOKEN = environment("TWILIO_TOKEN") ;
const PHONE = environment("PHONE") ;
const EN_TYPE = environment("EN_TYPE") ;
const USER_MAIL = environment("USER_MAIL") ;
const USER_PASSWORD = environment("USER_PASSWORD") ;
const S1 = environment("S1") ;
const A1 = environment("A1") ;
const USER_ROLE = environment("USER_ROLE") ;
const ApiError = require('./apierror');
const CLOUD_NAME = environment("CLOUD_NAME");
const API_KEY = environment("API_KEY");
const API_SECRET =environment("API_SECRET");
module.exports = {
  PORT,
  DBURI,
  ENCODED_DATA,
  SECRET_KEY,
  TWILIO_SID,
  TWILIO_TOKEN,
  PHONE,
  EN_TYPE,
  USER_MAIL,
  USER_PASSWORD,
  connectDb,
  ApiError,
  errorHandler,
  S1,
  A1,
  USER_ROLE,
  environment,
  inBulid,CLOUD_NAME,  API_SECRET,API_KEY
};
