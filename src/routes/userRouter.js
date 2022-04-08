const express = require('express');
const { USER } = require('../config');
const router = express.Router();
const { registerUser, loginUser,editUser } = require('../controller');
const { checkRole } = require('../middleware/checkrole');
const { tokenVerify } = require('../middleware/verifyToken');
const { verifyToken, verifyOtp } = require('../services');

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
 * /api/v1/user/registeruser:
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

router.post('/registeruser', registerUser);

/**
 * @swagger
 * /api/v1/user/verifyuser/{token}:
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
router.get('/verifyuser/:token', verifyToken);

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
router.post('/loginuser', loginUser);

/**
 * @swagger
 * /api/v1/user/verifyuserotp:
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
router.post('/verifyuserotp', verifyOtp);
/**
 * @swagger
 * /api/v1/user/verifyuserotp:
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

router.post("/auth/editprofile",tokenVerify,checkRole(USER),editUser)

// router.post("/image",/*uploads.single('image')*/uploadProfileImg)
module.exports = router;
