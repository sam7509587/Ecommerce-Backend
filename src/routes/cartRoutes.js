const { USER } = require("../config")
const { addToCart, deleteProduct, deleteFromCart, incrementDecrement, showCart } = require("../controller")
const { tokenVerify, checkRole, formData } = require("../middleware");
const { validCartDetails, validIncrement } = require("../validations");
const router = require("express").Router()


/**
 * @swagger
 * components:
 *      schemas:
 *          cart:
 *              type: object
 *              required :
 *                  - productId
 *                  - quantity
 *              properties:
 *                  productId :
 *                      type : string
 *                  quantity :
 *                      type : number   
 *              example :
 *                  productId : "6253bb363904dbedf6b7a1ef"
 *                  quantity : "12"
 */


/**
 * @swagger
 * /api/v1/cart:
 *   post:
 *     summary: add new product to  cart
 *     tags: [Cart]   
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/cart'
 *     responses:
 *          200:
 *              description: product added to cart successfull
 *
 *          404:
 *              description : data doesnt found
 */

router.post("/",tokenVerify,checkRole(USER),formData,validCartDetails,addToCart)
/**
 * @swagger
 * /api/v1/cart/{id}:
 *  delete:
 *      summary: remove from cart
 *      tags: [cart]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to remove   
 *      responses:
 *          200:
 *              description: product deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.delete("/:id",tokenVerify,checkRole(USER),deleteFromCart)

/**
 * @swagger
 * /api/v1/cart/{id}:
 *  put:
 *      summary: remove from cart
 *      tags: [cart]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to remove  
 *          - in : query
 *            name: value   
 *            schema:
 *              type: string 
 *      responses:
 *          200: 
 *              description: product deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */

router.put("/:id",tokenVerify,checkRole(USER),validIncrement,incrementDecrement)
router.get("/",tokenVerify,checkRole(USER),showCart)
module.exports = router
