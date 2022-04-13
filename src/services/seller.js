const { User, sellerProfile } = require('../models');
const { sendMail, sendOtp, checkExp, generateOtp } = require('../utlilities');
const { SECRET_KEY } = require('../config/index');
const jwt = require('jsonwebtoken');
const async = require('hbs/lib/async');
exports.createUser = async (req) => {
  try {
    const newUser = await User.create(req);
    return newUser;
  } catch (err) {
    return err;
  }
};
exports.userLogin = async (req, res, userLogin) => {
  if (userLogin.isVerified === true) {
    if (userLogin.isApproved === true) {
      if (req.body.email) {
        const payload = {
          uad: userLogin._id,
        };
        refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
        accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
        res.status(200).cookie("access_token", accessToken, {
          httpOnly: true,
        }).json({
          message: 'log in successfull and token has been sent',
          refreshToken,
          accessToken,
          status: 200,
          success: true,
        });
      } else {
        const expDate = await checkExp(req);
        if (expDate >= 10 || userLogin.otp === null || expDate === NaN) {
          const otp = generateOtp();
          const userotp = await sendOtp(req, otp, 'will expire in 10 min');
          await User.updateOne(
            { phoneNumber: req.body.phoneNumber },
            { otp, otpExp: Date.now() }
          );
          if (userotp != 'Error') {
            res.status(200).json({
              status: 200,
              message: 'otp has been sent kindly verify in 10 min to log in ',
              success: true,
            });
          } else {
            res.status(500).json({
              status: 500,
              message:
                ' unknown error occured try after some time or unverified user by twilio',
              hint: 'try email for logging in',
              success: false,
            });
          }
        } else {
          res.status(401).json({
            status: 401,
            message:
              'otp time not expired yet kindly wait for 10 min to get new otp',
          });
        }
      }
    } else {
      res.status(401).json({
        message: 'you are not approved by admin , kindly wait',
        status: 401,
        success: false,
      });
    }
  } else {
    // if (req.body.phoneNumber) {
    //     const expDate = await checkExp(req)
    //     if (expDate >= 10) {
    //         const otp = generateOtp()
    //         await sendOtp(req, otp, "is your otp and will expire in 10 min")
    //         await User.updateOne({ phoneNumber: req.body.phoneNumber }, { otp, otpExp: Date.now() })
    //         res.status(401).json({ status: 401, message: "Already a user ; Otp has been sent kindly verify in 10 min " })
    //     } else {
    //         res.status(401).json({ status: 401, message: "otp time not expired yet kindly wait for 10 min to get new otp" })
    //     }
    // }
    // else if (req.body.email)
    // {
    const expDate = await checkExp(req);
    if (expDate >= 10) {
      const token = userLogin.resetToken;
      req.body.email = userLogin.email;
      await sendMail(req, token, 'Verify your Account');
      await User.updateOne({ email: req.body.email }, { tokenExp: Date.now() });
      res.status(401).json({
        status: 401,
        message:
          'Already a user but not verified user; email has been sent kindly verify in 10 min ',
      });
    } else {
      res.status(401).json({
        status: 401,
        message: 'token time is not expired yet kindly verify your email',
      });
    }
    // }
  }
};

exports.verifyToken = async (req, res, next) => {
  const expDate = await checkExp(req);
  const resetToken = req.params.token;
  const user = await User.findOne({ resetToken });
  if (resetToken) {
    if (user) {
      if (user.isVerified === false) {
        if (expDate <= 10) {
          await User.updateOne(
            { resetToken },
            { isVerified: true, refreshToken: null }
          );
          res.status(200).json({
            message: 'user verfified successfull !! wait for admins approval',
            status: 200,
            success: true,
          });
        } else {
          res
            .status(401)
            .json({ status: 401, message: 'token expired', success: false });
        }
      } else {
        res.json({
          message: 'already verified',
          success: false,
        });
      }
    } else {
      return next(ApiError.Unauthorised('invalid token'));
    }
  } else {
    return next(ApiError.BadRequest('No token found'));
  }
};

exports.verifyOtp = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const Otp = req.body.otp;
  const user = await User.findOne({ phoneNumber });
  if (user) {
    if (user.isVerified === true) {
      if (user.otp === Otp) {
        const expDate = await checkExp(req);
        if (expDate <= 10 || user.otp === null || expDate === NaN) {
          const payload = {
            uad: user._id,
          };
          refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
          accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
          res.status(200).json({
            message: 'log in successfull',
            refreshToken,
            accessToken,
            status: 200,
            success: true,
          });
          await User.updateOne({ phoneNumber }, { otp: null, otpExp: null });
        } else {
          res
            .status(401)
            .json({ status: 401, message: 'otp expired', success: false });
        }
      } else {
        res.status(401).json({
          message: 'invalid otp ',
          status: 401,
          success: false,
        });
      }
    } else {
      res.status(401).json({
        status: 401,
        message: 'not verified the email kindly verify it',
        success: false,
      });
    }
  } else {
    res.status(404).json({
      message: 'user not found ',
      status: 404,
      success: false,
    });
  }
};
exports.userPhoneLogin = async (req, res, userLogin) => {
  if (userLogin.password === req.body.password) {
    if (userLogin.isVerified === true) {
      if (userLogin.isApproved === true) {
        const payload = {
          uad: userLogin._id,
        };
        refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
        accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
        res.status(200).json({
          message: 'log in successfull',
          refreshToken,
          accessToken,
          status: 200,
          success: true,
        });
      } else {
        res.status(401).json({
          message: 'you are not approved by admin , kindly wait',
          status: 401,
          success: false,
        });
      }
    } else {
      const email = userLogin.email;
      const expDate = await checkExp(req);
      if (expDate >= 10) {
        const token = userLogin.resetToken;
        await sendMail(req, token, 'Verify your Account');
        await User.updateOne({ email }, { tokenExp: Date.now() });
        res.status(401).json({
          status: 401,
          message:
            'Already a user but not verified; email has been sent kindly verify in 10 min ',
        });
      } else {
        res.status(401).json({
          status: 401,
          message:
            'token time is not expired yet kindly verify your email and than use phone to login',
        });
      }
    }
  } else {
    res.status(401).json({
      message: 'wrong password !!',
      status: 401,
      success: false,
    });
  }
};

exports.updateSellerBody=async(req,id)=>{
  const {gstNumber,document,...rest}=req.body
  const presentData = await sellerProfile.findOne({userId:id})
  if(presentData){
    if(gstNumber&&document &&rest){
      await User.updateOne({_id:id},rest);
      await sellerProfile.updateOne({userId:id},{gstNumber:gstNumber,document:document,userId: id,isKyc:true})
    }
    else if(gstNumber && document){
      await sellerProfile.updateOne({userId:id},{gstNumber:gstNumber,document:document,userId: id,isKyc:true})
  }
  else if(document&&rest){
    await User.updateOne({_id:id},rest);
    await sellerProfile.updateOne({userId:id},{document:document,userId: id})
   
  }
  else if(gstNumber &&rest){
    await User.updateOne({_id:id},rest);
    await sellerProfile.updateOne({userId:id},{gstNumber:gstNumber,userId: id})
  }
  else if(gstNumber){
    await sellerProfile.updateOne({userId:id},{gstNumber:gstNumber,userId: id})
  }
  else if(document){
    await sellerProfile.updateOne({userId:id},{document:document,userId: id})
  }
  else {
    await User.updateOne({_id:id},rest)
  }
  }else{
    req.body.userId = id
    if(gstNumber&&document &&rest){
      await User.updateOne({_id:id},rest);
      await sellerProfile.create({userId:id,gstNumber:gstNumber,document:document,userId: id,isKyc:true})
    }
    else if(gstNumber && document){
      await sellerProfile.create({userId:id,gstNumber:gstNumber,document:document,userId: id,isKyc:true})
  }
  else if(document&&rest){
    await User.updateOne({_id:id},rest);
    await sellerProfile.create({userId:id ,document:document,userId: id})
  }
  else if(gstNumber &&rest){
    await User.updateOne({_id:id},rest);
    await sellerProfile.create({userId:id,gstNumber:gstNumber,userId: id})
  }
  else if(gstNumber){
    await sellerProfile.create({userId:id,gstNumber:gstNumber,userId: id})
  }
  else if(document){
    await sellerProfile.create({userId:id,document:document,userId: id})
  }
  else {
    await User.updateOne({_id:id},rest)
  }
  }
}
