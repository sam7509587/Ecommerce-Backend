const nodeCron = require("node-cron");
const {USER} = require("../config");
const { User } = require("../models");
const { sendMailtoAll } = require("../utlilities");

const mailToUnverifed=async()=>{
const emails = await User.find({role:USER,isVerified:false});
emails.forEach(element => {
    sendMailtoAll(element)
});
}
nodeCron.schedule('0 1 * * * ', async() => {
   await mailToUnverifed()
});
