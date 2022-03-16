const express = require("express");
const router = express.Router();
const {loginHbs} = require("../controller/hbsControl")

router.post("/login",loginHbs)
module.exports =router;
