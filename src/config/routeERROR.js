exports.timeOut=(req, res, next)=>{
    res.setTimeout(5000, function(){
            res.status(408).json({status: 408,message:"Request has timed out.",success:false});
        });
    next();
  };
exports.otherRoute=(req,res,next)=>{
    res.status(400).json({status: 404, message : "route not found"})
}
