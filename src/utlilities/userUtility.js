const { USER, USER_MAIL, USER_PASSWORD, PORT, SECRET_KEY } = require('../config');
const { template } = require("../templates/mailTemplete");
// const bcrypt = require("bcrypt")

exports.UserData = async(req) => {
  req.body.isApproved = true;
  req.body.role = USER;
// req.body.password = await bcrypt.hash(SECRET_KEY,12)
  return req.body;
};
const nodemailer = require("nodemailer");
const async = require('hbs/lib/async');
exports.sendMailtoAll = async (user, token = undefined) => {
  const fullName = user.fullName
  const greeting = "Hello"
    const link = `<td align="center" style="border-radius: 3px;" bgcolor="#2874f0"><a href="http://127.0.0.1:${PORT}/api/v1/${USER}/verify${USER}/${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #2874f0; display: inline-block;">Confirm Email</a></td>`
    msgBody = template(greeting,fullName,"PLEASE verify your account to avail offers",link)
  const email = user.email;
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
  require("../templates/mailTemplete")
  const result = await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return 'error';
    } else {
      return 'info';
    }
  });
  return result;
};
