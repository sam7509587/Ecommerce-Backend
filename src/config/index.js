require("dotenv").config()
const connectDb = require("./connectdb")
const PORT = process.env.PORT;
const DBURI  = process.env.DBURI;
const ENCODED_DATA = process.env.ENCODED_DATA;
const SECRET_KEY = process.env.SECRET_KEY;
const TWILIO_SID= process.env.TWILIO_SID;
const TWILIO_TOKEN= process.env.TWILIO_TOKEN;
const PHONE = process.env.PHONE;
const EN_TYPE = process.env.EN_TYPE;
const USER_MAIL =process.env.USER_MAIL;
const USER_PASSWORD =process.env.USER_PASSWORD;
const S1= process.env.S1;
const A1=process.env.A1;
const U1= process.env.U1;
const {errorHandler} = require("./error_handle");
const ApiError = require("./apierror")

module.exports = {PORT,DBURI,ENCODED_DATA,SECRET_KEY,TWILIO_SID,
    TWILIO_TOKEN,PHONE,EN_TYPE,USER_MAIL,USER_PASSWORD,connectDb,ApiError
    ,errorHandler,S1,A1,U1
}
