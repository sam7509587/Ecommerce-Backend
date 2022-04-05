const express = require('express');
const { SELLER } = require('../config');
const router = express.Router();

const { login, registerSelller } = require('../controller');
const { editSellerProfile } = require('../controller/sellerControl');
const { checkRole } = require('../middleware/checkrole');
const { tokenVerify } = require('../middleware/verifyToken');
const { verifyToken, verifyOtp } = require('../services/index');

/**
 * @swagger
 * components:
 *      schemas:
 *          seller:
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
 *          sellerlogin:
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
 *  name: Seller
 *  description: the sellers api
 */

/**
 * @swagger
 * /api/v1/seller/registerseller:
 *   post:
 *     summary: Create a new Seller
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/seller'
 *     responses:
 *       200:
 *         description: The Seller was successfully registered
 *       500:
 *         description: Some server error
 */
router.post('/registerseller', registerSelller);

/**
 * @swagger
 * /api/v1/seller/verifyseller/{token}:
 *  get:
 *      summary: verify seller email by token
 *      tags: [Seller]
 *      parameters:
 *          - in : path
 *            name: token
 *            schema:
 *              type: string
 *            required: true
 *            description: the seller token to verify
 *      responses:
 *          200:
 *              description: the token is verified
 *          404:
 *              description : seller doesnt found
 */
router.get('/verifyseller/:token', verifyToken);
/**
 * @swagger
 * /api/v1/seller/loginseller:
 *   post:
 *     summary: login Seller
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sellerlogin'
 *     responses:
 *       200:
 *         description: The Seller was successfully registered
 *       500:
 *         description: Some server error
 */
router.post('/loginseller', login);
/**
 * @swagger
 * /api/v1/seller/verifyotp:
 *   post:
 *     summary: Verify Otp for logging in
 *     tags: [Seller]
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
 *          description : login successfull
 *       500:
 *         description: Some server error
 */
router.post('/verifyotp', verifyOtp);

/**
 * @swagger
 * /api/v1/seller/auth/editprofile:
 *   post:
 *     summary: edit profile
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/seller'
 *     responses:
 *       200:
 *         description: The Seller was successfully registered
 *       500:
 *         description: Some server error
 */
router.post("/auth/editprofile",tokenVerify,checkRole(SELLER),editSellerProfile)
module.exports = router;
