const { User, sellerProfile } = require('../models');
const { sendMail, sendOtp, checkExp, generateOtp } = require('../utlilities');
const { SECRET_KEY, ApiError } = require('../config/index');
const jwt = require('jsonwebtoken');
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
        accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
        userLogin.isDeleted = false;
        await userLogin.save()
        return res.status(200).cookie("access_token", accessToken, {
          httpOnly: true,
        }).json({
          statusCode: 200,
          message: 'log in successfull and token has been sent',
          token:accessToken
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
            return res.status(200).json({
              statusCode: 200,
              message: 'otp has been sent kindly verify in 10 min to log in ',
            });
          } else {
            return res.status(500).json({
              statusCode: 500,
              message:
                ' unknown error occured try after some time or unverified user by twilio',
              hint: 'try email for logging in'
            });
          }
        } else {
          return res.status(401).json({
            statusCode: 401,
            message:
              'otp time not expired yet kindly wait for 10 min to get new otp',
          });
        }
      }
    } else {
      return res.status(401).json({
        message: 'you are not approved by admin , kindly wait',
        statusCode: 401
      });
    }
  } else {
    const expDate = await checkExp(req);
    if (expDate >= 10) {
      const token = userLogin.resetToken;
      req.body.email = userLogin.email;
      await sendMail(req, token, 'Verify your Account');
      await User.updateOne({ email: req.body.email }, { tokenExp: Date.now() });
      return res.status(401).json({
        statusCode: 401,
        message:
          'Already a user but not verified user; email has been sent kindly verify in 10 min ',
      });
    } else {
      return res.status(401).json({
        statusCode: 401,
        message: 'token time is not expired yet kindly verify your email',
      });
    }
  }
};

exports.verifyToken = async (req, res, next) => {
  const expDate = await checkExp(req);
  const resetToken=req.params.token
  const user = await User.findOne({resetToken});
  if (!user) {
    return next(new ApiError(403, "Unauthorised User"))
  }
  if (user.isVerified === true) {
    return next(new ApiError(409, "already verified"))
  }
  if (expDate >= 10) {
    return next(new ApiError(401, "token expired"))
  }
  await User.updateOne(
    { resetToken },
    { isVerified: true, refreshToken: null }
  );
  if(user.role==="seller"){
   return res.status(200).json({
      message: 'seller verfified successfull !! wait for admin approval ',
      statusCode: 200
    });
  }
  return res.status(200).json({
    message: 'user verfified successfull !! can login now ',
    statusCode: 200
  });
};

exports.verifyOtp = async (req, res,next) => {
  const {phoneNumber} = req.body;
const Otp = req.body.otp
  if(!phoneNumber && !Otp){
    return next(new ApiError(404,"please provide both otp and phoneNumber"))
  }

  const user = await User.findOne({phoneNumber});
  if (user) {
    if (user.isVerified === true) {
      console.log(user.otp,Otp)
      if (user.otp === Otp) {
        const expDate = await checkExp(req);
        if (expDate <= 10 || user.otp === null || expDate === NaN) {
          const payload = {
            uad: user._id,
          };
          accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
          return res.status(200).json({
            statusCode: 200,
            message: 'log in successfull',
           token :accessToken,
          });
          await User.updateOne({ phoneNumber }, { otp: null, otpExp: null });
        } else {
          res
            .status(401)
            .json({ statusCode: 401, message: 'otp expired' });
        }
      } else {
        return res.status(401).json({
          statusCode: 401,
          message: 'invalid otp '
        });
      }
    } else {
      return res.status(401).json({
        statusCode: 401,
        message: 'not verified the email kindly verify it'
      });
    }
  } else {
    return res.status(404).json({
      message: 'user not found check phoneNumber',
      statusCode: 404
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
        accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).json({
          statusCode: 200,
          message: 'log in successfull',
          data: accessToken,
        });
      } else {
        return res.status(401).json({
          statusCode: 401,
          message: 'you are not approved by admin , kindly wait',
        });
      }
    } else {
      const email = userLogin.email;
      const expDate = await checkExp(req);
      if (expDate >= 10) {
        const token = userLogin.resetToken;
        await sendMail(req, token, 'Verify your Account');
        await User.updateOne({ email }, { tokenExp: Date.now() });
        return res.status(401).json({
          statusCode: 401,
          message:
            'Already a user but not verified; email has been sent kindly verify in 10 min ',
        });
      } else {
        return res.status(401).json({
          statusCode: 401,
          message:
            'token time is not expired yet kindly verify your email and than use phone to login',
        });
      }
    }
  } else {
    return res.status(401).json({
      statusCode: 401,
      message: 'wrong password !!'
    });
  }
};

exports.updateSellerBody = async (req, id) => {
  const { gstNumber, document, ...rest } = req.body
  const presentData = await sellerProfile.findOne({ userId: id })
  if (presentData) {
    if (gstNumber && document && rest) {
      await User.updateOne({ _id: id }, rest);
      await sellerProfile.updateOne({ userId: id }, { gstNumber: gstNumber, document: document, userId: id, isKyc: true })
    }
    else if (gstNumber && document) {
      await sellerProfile.updateOne({ userId: id }, { gstNumber: gstNumber, document: document, userId: id, isKyc: true })
    }
    else if (document && rest) {
      await User.updateOne({ _id: id }, rest);
      await sellerProfile.updateOne({ userId: id }, { document: document, userId: id })

    }
    else if (gstNumber && rest) {
      await User.updateOne({ _id: id }, rest);
      await sellerProfile.updateOne({ userId: id }, { gstNumber: gstNumber, userId: id })
    }
    else if (gstNumber) {
      await sellerProfile.updateOne({ userId: id }, { gstNumber: gstNumber, userId: id })
    }
    else if (document) {
      await sellerProfile.updateOne({ userId: id }, { document: document, userId: id })
    }
    else {
      await User.updateOne({ _id: id }, rest)
    }
  } else {
    req.body.userId = id
    if (gstNumber && document && rest) {
      await User.updateOne({ _id: id }, rest);
      await sellerProfile.create({ userId: id, gstNumber: gstNumber, document: document, userId: id, isKyc: true })
    }
    else if (gstNumber && document) {
      await sellerProfile.create({ userId: id, gstNumber: gstNumber, document: document, userId: id, isKyc: true })
    }
    else if (document && rest) {
      await User.updateOne({ _id: id }, rest);
      await sellerProfile.create({ userId: id, document: document, userId: id })
    }
    else if (gstNumber && rest) {
      await User.updateOne({ _id: id }, rest);
      await sellerProfile.create({ userId: id, gstNumber: gstNumber, userId: id })
    }
    else if (gstNumber) {
      await sellerProfile.create({ userId: id, gstNumber: gstNumber, userId: id })
    }
    else if (document) {
      await sellerProfile.create({ userId: id, document: document, userId: id })
    }
    else {
      await User.updateOne({ _id: id }, rest)
    }
  }
}
