const express = require('express');
const { SELLER, ADMIN } = require('../config');
const router = express.Router();
const { addProduct ,showProductSeller,editProduct,deleteProduct,showProduct,deleteSinglePhoto} = require('../controller');
const { checkRole,tokenVerify, formData } = require('../middleware');
const { validProduct, validEntry } = require('../validations');

/**
 * @swagger
 * components:
 *      schemas:
 *          product:
 *              type: object
 *              required :
 *                  - productName
 *                  - price
 *                  - categoryId
 *                  - brandId
 *                  - quantity
 *                  - description
 *                  - image
 *              properties:
 *                  productName :
 *                      type : string
 *                  price :
 *                      type : number
 *                  categoryId :
 *                      type : string
 *                  brandId :
 *                      type : string
 *                  quantity :
 *                      type : number
 *                  description :
 *                      type : string
 *                  image :
 *                      type: string
 *                      format: binary     
 *              example :
 *                  productName : "glass"
 *                  price : "50"
 *                  categoryId : "624be02f1deac47ed8f5f000"
 *                  brandId : "624bdfd1c359b11e4c9d76a7"
 *                  quantity : "12"
 *                  description : "This item is made of transparent glass"
 */

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: the products api
 */

/**
 * @swagger
 * /api/v1/product:
 *   post:
 *     summary: add new product 
 *     tags: [Products]   
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/product'
 *     responses:
 *          200:
 *              description: product created successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.post("/",tokenVerify,checkRole(SELLER,ADMIN),formData,validProduct,addProduct)
/**
 * @swagger
 * /api/v1/product:
 *  get:
 *      summary: show all the products of seller
 *      tags: [Products]
 *      parameters:
 *          - in : query
 *            name: limit
 *            schema:
 *              type: number
 *              description: enter the number of recored you want to see
 *          - in : query
 *            name: page
 *            schema:
 *              type: number 
 *          - in : query
 *            name: filter  
 *            schema:
 *              type: object 
 *          - in: query
 *            name: fields       
 *      responses:
 *          200:
 *              description: this is the list of products
 */
router.get("/",tokenVerify,checkRole(SELLER,ADMIN),formData,showProductSeller)
/**
 * @swagger
 * /api/v1/product/{id}:
 *  put:
 *      summary: edit a product by id
 *      tags: [Products]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to see  
 *      requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/product'    
 *      responses:
 *          200:
 *              description: product edited successfull !!
 *
 *          404:
 *              description : data doesnt found
 */
router.put("/:id",tokenVerify,checkRole(SELLER,ADMIN),formData,validEntry,editProduct)

/**
 * @swagger
 * /api/v1/product/{id}:
 *  get:
 *      summary: show the products by id
 *      tags: [Products]
 *      parameters:
 *          - in : params
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to see 
 *      responses:
 *          200:
 *              description: product deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.get("/:id",tokenVerify,checkRole(SELLER,ADMIN),formData,showProduct)
/**
 * @swagger
 * /api/v1/product/{id}:
 *  delete:
 *      summary: delete product
 *      tags: [Products]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to see   
 *      responses:
 *          200:
 *              description: product deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.delete("/:id",tokenVerify,checkRole(SELLER,ADMIN),deleteProduct)
// router.delete("/:id",tokenVerify,checkRole(SELLER),deleteSinglePhoto)
module.exports = router
