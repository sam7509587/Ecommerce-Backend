const express = require('express');
const {USER, SELLER } = require('../config');
const { placeOrder, getAllOrders, getOrder, cancelOrder, changeStatus,fetchDates } = require('../controller');
const { checkRole, tokenVerify } = require('../middleware');
const { validOrder } = require('../validations');
const router = express.Router();


router.get("/fetch_dates",tokenVerify,checkRole(USER),fetchDates)
/**
 * @swagger
 * components:
 *      schemas:
 *          order:
 *              type: object
 *                  - quantity
 *                  - addressId
 *              properties:
 *                  quantity:
 *                      type : number
 *                  addressId:
 *                      type : string   
 *              example :
 *                  quantity : 50
 *                  addressId: "6257f6f21f44e4dc6ca77c40 (optional)"
 */

/**
 * @swagger
 * tags:
 *  name: Order
 *  description: the products api
 */

/**
 * @swagger
 * /api/v1/order/{id}:
 *   post:
 *     summary: place new Order 
 *     tags: [Order]  
 *     parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string            
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/order'
 *     responses:
 *          200:
 *              description: order placed successfull
 *          404:
 *              description : data doesnt found
 */
router.post("/",tokenVerify,checkRole(USER),validOrder,placeOrder)
/**
 * @swagger
 * /api/v1/order:
 *  get:
 *      summary: show all orders
 *      tags: [Order]   
 *      responses:
 *          200:
 *              description: this is the list of orders
 */
router.get("/",tokenVerify,checkRole(USER),getAllOrders)

/**
 * @swagger
 * /api/v1/order/{id}:
 *   get:
 *     summary: get Order by id 
 *     tags: [Order]  
 *     parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string            
 *     responses:
 *          200:
 *              description: order found
 *
 *          404:
 *              description : data doesnt found
 */
router.get("/:id",tokenVerify,checkRole(USER),getOrder)

/**
 * @swagger
 * /api/v1/order/{id}:
 *   put:
 *     summary: cancelling order 
 *     tags: [Order]  
 *     parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string            
 *     responses:
 *          200:
 *              description: order cancelled successfull
 *
 *          404:
 *              description : data doesnt found
 */

router.put("/:id",tokenVerify,checkRole(USER),cancelOrder)
//////////order status//////
router.put("/status/:id",tokenVerify,checkRole(SELLER),changeStatus)
module.exports = router
