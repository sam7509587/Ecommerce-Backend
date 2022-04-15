const express = require('express');
const { ADMIN } = require('../config');
const router = express.Router();

const { showSeller, approveSeller, loginAdmin ,addCategory, deleteUserParmanently, getUser, rejectSeller} = require('../controller');
const { checkRole } = require('../middleware/checkrole');
const { tokenVerify } = require('../middleware/verifyToken');
const { validAdmin } = require('../validations');

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
router.post('/',validAdmin,loginAdmin);

/**
 * @swagger
 * /api/v1/admin/:
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
 *          - in : query
 *            name: search
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: this is the list of seller
 *
 *          404:
 *              description : seller doesnt found
 */
router.get('/',tokenVerify,checkRole(ADMIN),showSeller);
// router.get("/getseller/:id",tokenVerify,checkRole(ADMIN), )
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
router.get('/:id',tokenVerify,checkRole(ADMIN), approveSeller);
/**
 * @swagger
 * /api/v1/admin/{id}:
 *   post:
 *     summary: delete seller or user by id
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: The Admin has deleted seller/user
 *       500:
 *         description: Some server error
 */
router.delete("/:id",tokenVerify,checkRole(ADMIN),deleteUserParmanently)
/**
 * @swagger
 * /api/v1/admin/user/{id}:
 *   get:
 *     summary: delete seller or user by id
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: The user found
 *       500:
 *         description: Some server error
 */
router.get("/user/:id",tokenVerify,checkRole(ADMIN),getUser)
/**
 * @swagger
 * /api/v1/admin/user/{id}:
 *   get:
 *     summary: reject seller or user by id
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: The user found
 *       500:
 *         description: Some server error
 */
router.get("/reject/:id",tokenVerify,checkRole(ADMIN),rejectSeller)
module.exports = router;
