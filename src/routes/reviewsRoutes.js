const { USER } = require("../config");
const { addReview } = require("../controller/reviewsControl");
const router = require("express").Router();
const {tokenVerify,checkRole} =require("../middleware")

router.post("/",tokenVerify,checkRole(USER),addReview)
module.exports = router
