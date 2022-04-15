const express = require('express');
const { USER } = require('../config');
const router = express.Router();
const { registerUser, loginUser,editUser, deleteUser } = require('../controller');
const { checkRole } = require('../middleware/checkrole');
const { tokenVerify } = require('../middleware/verifyToken');
const { verifyToken, verifyOtp } = require('../services');
const { validSeller ,valid, validUserProfile} = require('../validations');

/**
 * @swagger
 * components:
 *      schemas:
 *          user:
 *              type: object
 *              required :
 *                  - fullName
 *                  - email
 *                  - phoneNumber
 *                  - password
 *              properties:
 *                  fullName:
 *                      type: string
 *                  email:
 *                      type: string
 *                  phoneNumber:
 *                      type: string
 *                  password:
 *                      type: string
 *              example:
 *                  fullName: "sameer khan"
 *                  phoneNumber : "7509587124"
 *                  email: "sameer@yopmail.com"
 *                  password: "1234567"
 *          userlogin:
 *              type: object
 *              required :
 *                  - email
 *                  - phoneNumber
 *                  - password
 *              properties:
 *                  email:
 *                      type: string
 *                  phoneNumber:
 *                      type: string
 *                  password:
 *                      type: string
 *              example:
 *                  phoneNumber : "7509587124"
 *                  email: "sameer@yopmail.com"
 *                  password: "1234567"
 */

/**
 * @swagger
 * tags:
 *  name: User
 *  description: the users api
 */

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Create a new User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       200:
 *         description: The User was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       500:
 *         description: Some server error
 */

router.post('/',validSeller,registerUser);

/**
 * @swagger
 * /api/v1/user/{token}:
 *  get:
 *      summary: verify user email by token
 *      tags: [User]
 *      parameters:
 *          - in : path
 *            name: token
 *            schema:
 *              type: string
 *            required: true
 *            description: the user token to verify
 *      responses:
 *          200:
 *              description: the token is verified
 *
 *          404:
 *              description : user doesnt found
 */
router.get('/:token', verifyToken);

/**
 * @swagger
 * /api/v1/user/loginuser:
 *   post:
 *     summary: login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/userlogin'
 *     responses:
 *       200:
 *         description: The User was successfully registered
 *       500:
 *         description: Some server error
 */
router.post('/loginuser',valid,loginUser);
 
/**
 * @swagger
 * /api/v1/user/verifyotp:
 *   post:
 *     summary: Verify Otp for logging in
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required :
 *                  - phoneNumber
 *                  - otp
 *              properties:
 *                  phoneNumber:
 *                      type: string
 *                  otp:
 *                      type: string
 *              example:
 *                  phoneNumber : "7509587124"
 *                  otp: "123456"
 *     responses:
 *       200:
 *         description: login successfull
 *       500:
 *         description: Some server error
 */
router.post('/verifyotp', verifyOtp);
/**
 * @swagger
 * /api/v1/user:
 *   put:
 *     summary: Verify Otp for logging in
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required :
 *                  - 
 *                  - otp
 *              properties:
 *                  phoneNumber:
 *                      type: string
 *                  otp:
 *                      type: string
 *              example:
 *                  phoneNumber : "7509587124"
 *                  otp: "123456"
 *     responses:
 *       200:
 *         description: login successfull
 *       500:
 *         description: Some server error
 */

router.put("/",tokenVerify,checkRole(USER),validUserProfile,editUser)


/**
 * @swagger
 * /api/v1/user:
 *   delete:
 *     summary: delete user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The User was successfully delted
 *       500:
 *         description: Some server error
 */
router.delete("/",tokenVerify,checkRole(USER),deleteUser)
// router.post("/image",/*uploads.single('image')*/uploadProfileImg)

module.exports = router;
