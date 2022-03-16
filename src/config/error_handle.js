const ApiError = require("./apierror")

exports.errorHandler=(err,req,res,next)=>{
    if(err instanceof ApiError) {
        res.status(err.code).json({
            status : err.code,
            message  : err.msg,
            success : false
        })
    }
    res.status(500).json({status :500,
    message : "something went wrwong",
success : false})
}

