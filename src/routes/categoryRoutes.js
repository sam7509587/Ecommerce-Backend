const express = require("express");
const router = express.Router()
const { ADMIN } = require("../config");
const {tokenVerify,checkRole, formData}= require("../middleware")
const {editCategorys,showAllCategorys,deleteCategory,showCategory,addCategory}=require("../controller");
const { validCategory } = require("../validations");

/**
 * @swagger
 * components:
 *      schemas:
 *          category:
 *              type: object
 *              required :
 *                  - categoryName
 *                  - description
 *                  - image
 *              properties:
 *                  categoryName :
 *                      type : string
 *                  description :
 *                      type : string
 *                  image :
 *                      type: string
 *                      format: binary     
 *              example :
 *                  categoryName : "glass"
 *                  description : "This item is made of transparent glass"
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: add category admin
 *     tags: [Category]
 *     requestBody:
 *       required:
 *       content:
 *         multipart/form-data:
 *           schema:
 *              $ref: '#/components/schemas/brand' 
 *     responses:
 *          200:
 *              description: category deleted successfull
 *          404:
 *              description : data doesnt found
 */
 router.post("/",tokenVerify,checkRole(ADMIN),formData,validCategory,addCategory)

/**
 * @swagger
 * /category/{id}:
 *  get:
 *      summary: show the category by id
 *      tags: [Category]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of category you want to see 
 *      responses:
 *          200:
 *              description: category deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */
 router.get("/:id",tokenVerify,checkRole(ADMIN),showCategory)

 /**
 * @swagger
 * /category/:
 *  get:
 *      summary: show the all category
 *      tags: [Category]
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
 *              description: category found successfull
 *
 *          404:
 *              description : data doesnt found
 */
 router.get("/",tokenVerify,checkRole(ADMIN),showAllCategorys)

/**
 * @swagger
 * /category/{id}:
 *  put:
 *      summary: edit a category by id
 *      tags: [Category]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to see  
 *      requestBody:
 *       required: true
 *       content:
 *          multipart/form-data:
 *           schema:
 *              $ref: '#/components/schemas/brand'
 *      responses:
 *        200:
 *          description: category added
 *        500:
 *          description: Some server error
 */
 router.put("/:id",tokenVerify,checkRole(ADMIN),validCategory,editCategorys)
/**
 * @swagger
 * /category/{id}:
 *  delete:
 *      summary: delete category
 *      tags: [Category]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of to delete it.   
 *      responses:
 *          200:
 *              description: category deleted successfull
 *          404:
 *              description : data doesnt found
 */
 router.delete("/:id",tokenVerify,checkRole(ADMIN),deleteCategory)
module.exports = router;
