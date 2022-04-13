const { USER } = require("../config")
const { addToCart, deleteProduct, deleteFromCart, incrementDecrement, showCart, clearCart } = require("../controller")
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
 *      tags: [Cart]
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
 *      summary: increment and decrement for product
 *      tags: [Cart]
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


 /**
 * @swagger
 * /api/v1/cart:
 *  get:
 *      summary: show the all products in cart
 *      tags: [Cart]
 *      parameters:
 *          - in : query
 *            name: page
 *            schema:
 *              type: string
 *          - in : query
 *            name: limit   
 *            schema:
 *              type: string 
 *          - in : query
 *      responses:
 *          200:
 *              description: cart found successfull
 *
 *          404:
 *              description : data doesnt found
 */

router.get("/",tokenVerify,checkRole(USER),showCart)
 /**
 * @swagger
 * /api/v1/cart:
 *  delete:
 *      summary: clear cart
 *      tags: [Cart]
 *      responses:
 *          200:
 *              description: cart deleted successfull
 *
 *          404:
 *              description : cart doesnt found
 */
router.delete("/",tokenVerify,checkRole(USER),clearCart)

module.exports = router
