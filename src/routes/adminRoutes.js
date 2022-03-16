const express = require("express");
const router = express.Router();

const {showSeller,approveSeller,loginAdmin}= require("../controller");


router.post("/loginAdmin",loginAdmin)
router.get("/getsellers",showSeller)
router.post("/approve",approveSeller)

module.exports = router
