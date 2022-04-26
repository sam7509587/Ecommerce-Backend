const  {publicRoutes, PUBLIC}  = require("../config")

exports.checkRoute=(req)=>{
  req.user = {role : PUBLIC}
   return publicRoutes.find((obj) =>{
        return (obj.baseUrl === req.baseUrl) &&  (obj.method === req.method)
    })
  }
  
