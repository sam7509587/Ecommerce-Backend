const express = require('express');
const { ADMIN } = require('../config');
const router = express.Router();

const { showSeller, approveSeller, loginAdmin ,addCategory,addBrand} = require('../controller');
const { checkRole } = require('../middleware/checkrole');
const { tokenVerify } = require('../middleware/verifyToken');

router.get("/adminLogin",(req,res)=>{
    res.render("index")
})
/**
 * @swagger
 * /api/v1/admin/loginAdmin:
 *   post:
 *     summary: login admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required :
 *                  - email
 *                  - password
 *              properties:
 *                  email:
 *                      type: string
 *                  phoneNumber:
 *                      type: string
 *                  password:
 *                      type: string
 *              example:
 *                  email: "sameer@yaml.com"
 *                  password: "1234567"
 *     responses:
 *       200:
 *         description: The Admin was successfully login
 *       500:
 *         description: Some server error
 */
router.post('/loginAdmin', loginAdmin);

/**
 * @swagger
 * /api/v1/admin/getsellers:
 *  get:
 *      summary: verify seller email by token
 *      tags: [Admin]
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
 *              description: enter the number of page to see the data of that page
 *          - in : query
 *            name: fields
 *            schema:
 *              type: array
 *              description: enter the fields you want to see about seller
 *      responses:
 *          200:
 *              description: this is the list of seller
 *
 *          404:
 *              description : seller doesnt found
 */
router.post('/auth/getsellers',tokenVerify,checkRole(ADMIN),showSeller);

/**
 * @swagger
 * /api/v1/admin/approve:
 *   post:
 *     summary: login admin
 *     tags: [Admin]
 *     requestBody:
 *       required:
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required :
 *                  - sellerId
 *              properties:
 *                  sellerId:
 *                      type: string
 *              example:
 *                  sellerId: "623aeac236bedfe55efc4ba9"
 *     responses:
 *       200:
 *         description: The Admin has approved seller
 *       500:
 *         description: Some server error
 */
router.post('/auth/approve',tokenVerify,checkRole(ADMIN), approveSeller);

/**
 * @swagger
 * /api/v1/admin/addcategory:
 *   post:
 *     summary: add catagory admin
 *     tags: [Ctaegory]
 *     requestBody:
 *       required:
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required :
 *                  - name
 *              properties:
 *                  name:
 *                      type: string
 *              example:
 *                  name: "clothing"
 *     responses:
 *       200:
 *         description: catagory added
 *       500:
 *         description: Some server error
 */
router.post("/auth/addcategory",tokenVerify,checkRole(ADMIN),addCategory)

/**
 * @swagger
 * /api/v1/admin/addbrand:
 *   post:
 *     summary: add brand admin
 *     tags: [Brand]
 *     requestBody:
 *       required:
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required :
 *                  - name
 *              properties:
 *                  name:
 *                      type: string
 *              example:
 *                  name: "clothing"
 *     responses:
 *       200:
 *         description: catagory added
 *       500:
 *         description: Some server error
 */
 router.post("/auth/addbrand",tokenVerify,checkRole(ADMIN),addBrand)
module.exports = router;
