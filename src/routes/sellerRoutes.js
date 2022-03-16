const express = require("express");
const router = express.Router()

const {login}= require("../controller")
const {verifyToken,verifyOtp} = require("../services/index")

router.get("/home",(req,res)=>{
    res.send("<h1> connect </h1>")
})
router.post("/login",login)
router.get("/verify/:token",verifyToken)
router.post("/verifyotp",verifyOtp)
module.exports = router

