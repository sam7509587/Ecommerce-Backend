
const { User, sellerProfile } = require("../models");

exports.updateBody=async(req,id)=>{
    try{
       const updated= await User.updateOne({_id:id},req.body,{new:true})
    }catch(err){
        console.log(err)
    }
}