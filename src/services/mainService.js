const { User } = require("../models")
exports.updateBody=async(req,id)=>{
const user = await User.findOneAndUpdate({_id:[id]},req.body,{new :true})
return user
}
