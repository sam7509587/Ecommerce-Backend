const router = require("express").Router();
const { USER } = require("../config");
const { addReview,deleteReview,editReview } = require("../controller");
const {tokenVerify,checkRole} =require("../middleware");
const { validReview, validReviewEdit } = require("../validations");


/**
 * @swagger
 * /api/v1/review/{id}:
 *   post:
 *     summary: comment on product by productId
 *     tags: [Review]  
 *     parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string            
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *                  - rating
 *                  - comment
 *              properties:
 *                  rating :
 *                      type : number
 *                  comment:
 *                      type : string   
 *              example :
 *                  rating : 3
 *                  comment: "this is a good product"
 *     responses:
 *          200:
 *              description: comented successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.post("/:id",tokenVerify,checkRole(USER),validReview,addReview)

/**
 * @swagger
 * /api/v1/review/{id}:
 *   put:
 *     summary: edit your comment by reviewId
 *     tags: [Review]  
 *     parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string            
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *                  - rating
 *                  - comment
 *              properties:
 *                  rating :
 *                      type : number
 *                  comment:
 *                      type : string   
 *              example :
 *                  rating : 3
 *                  comment: "this is a good product"
 *     responses:
 *          200:
 *              description: review edited successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.put("/:id",tokenVerify,checkRole(USER),validReviewEdit,editReview)

/**
 * @swagger
 * /api/v1/review/{id}:
 *   put:
 *     summary: delete your comment by reviewId
 *     tags: [Review]  
 *     parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string            
 *     responses:
 *          200:
 *              description: review deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.delete("/:id",tokenVerify,checkRole(USER),deleteReview)
module.exports = router
