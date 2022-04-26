exports.timeOut=(req, res, next)=>{
    res.setTimeout(5000, function(){
            return res.status(408).json({statusCode: 500,message:"Request has timed out."});
        });
    next();
  };
exports.otherRoute=(req,res,next)=>{
    return res.status(400).json({statusCode: 404, message : "route not found"})
}
