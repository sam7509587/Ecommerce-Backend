const { upload, ApiError } = require("../config")

exports.formData=(req,res,next)=>{ 
    upload(req,res,(err)=>{
        if(err){
            return next(new ApiError(400,err.message))
        }else{
        req.files = req.files || req.file
        req.body = req.body
        if(!req.files){
            return next()
        }else{
            const array = []
            for(file of req.files){
                if(array.includes(file.originalname)===false){
                    array.push(file.originalname)
                }else{
                    return next(new ApiError(409,"same files are not allowed"))
                }
            }
            next()}
        }
     })
}
