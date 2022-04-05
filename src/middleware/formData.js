const { upload, ApiError } = require("../config")

exports.formData=(req,res,next)=>{ 
    upload(req,res,(err)=>{
        if(err){
            return next(new ApiError(400,err.message))
        }else{
        req.files = req.files || req.file
        req.body = req.body
        next()}
     })
}
