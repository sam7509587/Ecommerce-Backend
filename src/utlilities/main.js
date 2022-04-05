const { User, productModel } = require('../models');
const {template}= require("../mailTemp/mailTemplete")
const {
  PHONE,
  TWILIO_TOKEN,
  TWILIO_SID,
  USER_MAIL,
  USER_PASSWORD,
  PORT,
  S1,
  ApiError,
} = require('../config');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const multer = require("multer")
const path =require("path");
exports.userPresent = async (req) => {
  try {
    if (req.body.phoneNumber != undefined && req.body.email != undefined) {
      const Phoneuser = await User.findOne({
        phoneNumber: req.body.phoneNumber,
      });
      const EmailUser = await User.findOne({ email: req.body.email });
      let user = EmailUser+Phoneuser
      return user;
    } else {
      if (req.body.email) {
        const user = await User.findOne({ email: req.body.email });
        return user;
      } else if (req.query.id) {
        const user = await User.findOne({ _id: req.query.id });
        return user;
      } else if (req.body.phoneNumber) {
        const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
        return user;
      }
    }
  } catch (err) {
    return err;
  }
};

exports.sendOtp = async (req, otp, msg) => {
  try {
    if (otp === undefined || null) {
      msg = msg;
    } else {
      msg = `${otp} ${msg}`;
    }
    const phoneNumber = req.body.phoneNumber;
    const client = await new twilio(TWILIO_SID, TWILIO_TOKEN);
    await client.messages.create({
      body: msg,
      to: `+91${phoneNumber}`,
      from: PHONE,
    });
    return req;
  } catch (err) {
    return err.name;
  }
};

exports.sendMail = async (req, token = undefined, msg, role = S1) => {
  const fullName = req.body.fullName
  const passedMsg = msg
  const greeting = "Hello"
  if (token === undefined || null) {
    const link = `<td align="center" style="border-radius: 3px;" bgcolor="#2874f0"><h3>Enjoy your journey</h3></td>`
    msgBody = template(greeting,fullName,passedMsg,link)

  } else {
    const link = `<td align="center" style="border-radius: 3px;" bgcolor="#2874f0"><a href="http://127.0.0.1:${PORT}/api/v1/${role}/verify${role}/${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #2874f0; display: inline-block;">Confirm Email</a></td>`
    msgBody = template(greeting,fullName,passedMsg,link)
  }
  const email = req.body.email;
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER_MAIL,
      pass: USER_PASSWORD,
    },
  });
  const mailOptions = {
    from: USER_MAIL,
    to: email,
    subject: 'Verify your mail',
    text: `Hey , it's our link to veriy the account and will going to expire in 10 mins  `,
    html:msgBody,
    attachments: [{
      filename: 'handshake.png',
      path: "https://img.icons8.com/clouds/100/000000/handshake.png",
      cid: 'handshake' 
 }]
  };
  require("../mailTemp/mailTemplete.js")
  const result = await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return 'error';
    } else {
      return 'info';
    }
  });
  return result;
};

exports.generateOtp = () => {
  let Otp = Math.floor(Math.random() * 1000000 + 1);
  return Otp;
};
exports.checkExp = async (req) => {
  if (req.body.email) {
    const user = await User.findOne({ email: req.body.email });
    const ExpDate = (Date.now() - user.tokenExp) / 60000;
    return ExpDate;
  } else if (req.body.phoneNumber) {
    const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (user.isVerified === false) {
      const ExpDate = (Date.now() - user.tokenExp) / 60000;

      return ExpDate;
    } else {
      const ExpDate = (Date.now() - user.otpExp) / 60000;
      return ExpDate;
    }
  } else {
    const user = await User.findOne({ resetToken: req.params.token });
    const ExpDate = (Date.now() - user.tokenExp) / 60000;
    return ExpDate;
  }
};

exports.verifyEmail = (req) => {
  const email = req.body.email;
  if (
    email.slice(email.length - 9, email.length) === 'gmail.com' ||
    email.slice(email.length - 11, email.length) === 'yopmail.com'
  ) {
    return true;
  }
  return false;
};
const imagePath = path.join(__dirname, "/../../uploads");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.fieldname + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
}).single("photo");

exports.uploadPhoto=async(req,res,next)=>{
  upload(req, res, async (err) => {
    req.data = req.body
    req.file = req.file
    if (err) {
      return next(new ApiError(404,`${err.name} - ${err.message}`))
    }
    next()
})};

exports.deletePhoto=async(req,res,next)=>{
  const user = req.user;
  upload(req, res, async (err) => {
    req.data = req.body
    req.file = req.file
    if (err) {
      return next(new ApiError(404,`${err.name} - ${err.message}`))
    }
    next()
})
}
