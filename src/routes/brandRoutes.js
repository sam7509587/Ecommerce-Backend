const express = require("express");
const router = express.Router()
const { addBrand, showBrand, showAllBrands, editBrands, deleteBrand } = require("../controller");
const { ADMIN } = require("../config");
const {tokenVerify,checkRole, formData}= require("../middleware");
const { validBrand } = require("../validations");


/**
 * @swagger
 * components:
 *      schemas:
 *          brand:
 *              type: object
 *              required :
 *                  - brandName
 *                  - description
 *                  - image
 *              properties:
 *                  brandName :
 *                      type : string
 *                  description :
 *                      type : string
 *                  image :
 *                      type: string
 *                      format: binary     
 *              example :
 *                  brandName : "glass"
 *                  description : "This item is made of transparent glass"
 */

/**
 * @swagger
 * /brand:
 *   post:
 *     summary: add brand admin
 *     tags: [Brand]
 *     requestBody:
 *       required:
 *       content:
 *         multipart/form-data:
 *           schema:
 *              $ref: '#/components/schemas/brand'
 *     responses:
 *       200:
 *         description: catagory added
 *       500:
 *         description: Some server error
 */
 router.post("/",tokenVerify,checkRole(ADMIN),formData,validBrand,addBrand)

/**
 * @swagger
 * /brand/{id}:
 *  get:
 *      summary: show the brand by id
 *      tags: [Brand]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of brand you want to see 
 *      responses:
 *          200:
 *              description: brand deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */
 router.get("/:id",tokenVerify,checkRole(ADMIN),showBrand)

 /**
 * @swagger
 * /brand/:
 *  get:
 *      summary: show the all brands
 *      tags: [Brand]
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
 *            name: search
 *            schema:
 *              type: string  
 *      responses:
 *          200:
 *              description: brands found successfull
 *
 *          404:
 *              description : data doesnt found
 */
 router.get("/",tokenVerify,checkRole(ADMIN),showAllBrands)

/**
 * @swagger
 * /brand/{id}:
 *  put:
 *      summary: edit a brand by id
 *      tags: [Brand]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to see  
 *      requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *              $ref: '#/components/schemas/brand' 
 *      responses:
 *        200:
 *          description: brand added
 *        500:
 *          description: Some server error
 */
 router.put("/:id",tokenVerify,checkRole(ADMIN),formData,validBrand,editBrands)
/**
 * @swagger
 * /brand/{id}:
 *  delete:
 *      summary: delete brand
 *      tags: [Brand]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of to delete it.   
 *      responses:
 *          200:
 *              description: brand deleted successfull
 *          404:
 *              description : data doesnt found
 */
 router.delete("/:id",tokenVerify,checkRole(ADMIN),deleteBrand)
module.exports = router;
