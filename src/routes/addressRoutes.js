const express = require('express');
const { SELLER, USER } = require('../config');
const router = express.Router();
const {
  createAddress,
  editAddress,
  deleteAddress,
  showAddress,
  showCountry,
  getAddress,
} = require('../controller');
const { tokenVerify, checkRole } = require('../middleware');
const { validAddress, validAddEdit } = require('../validations');
/**
 * @swagger
 * components:
 *      schemas:
 *          address:
 *              type: object
 *              required :
 *                  - fullName
 *                  - phoneNumber
 *                  - country
 *                  - state
 *                  - city
 *                  - street
 *                  - pinCode
 *                  - landMark
 *                  - houseNo
 *                  - addressType
 *              properties:
 *                  country :
 *                      type : string
 *                  state :
 *                      type : string
 *                  city :
 *                      type : string
 *                  street :
 *                      type : string
 *                  pinCode :
 *                      type : number
 *                  landMark :
 *                      type : string
 *                  houseNo :
 *                      type : string
 *                  addressType :
 *                      type : string
 *
 *              example :
 *                  country : "India"
 *                  state : "Mp"
 *                  city : "mhow"
 *                  street : "12"
 *                  pinCode : 453441
 *                  landMark : "near bridge"
 *                  houseNo : "127/98"
 *                  addressType : "office"
 */

/**
 * @swagger
 * tags:
 *  name: Address
 *  description: the address api
 */

/**
 * @swagger
 * /api/v1/address/:
 *   post:
 *     summary: Add new address
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/address'
 *     responses:
 *       200:
 *         description: The address added
 *       500:
 *         description: Some server error
 */
 
router.post('/',tokenVerify,checkRole(USER,SELLER),validAddress,createAddress);

/**
 * @swagger
 * /api/v1/address/{id}:
 *  put:
 *      summary: edit users address
 *      tags: [Address]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of address of which you want to edit
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/address'
 *      responses:
 *          200:
 *              description: edited successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.put('/:id',tokenVerify,checkRole(USER,SELLER),validAddEdit,editAddress);

/**
 * @swagger
 * /api/v1/address/{id}:
 *  delete:
 *      summary: delete address by id
 *      tags: [Address]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of address of which you want to delete
 *      responses:
 *          200:
 *              description: deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.delete('/:id',tokenVerify,checkRole(USER,SELLER),deleteAddress);
/**
 * @swagger
 * /api/v1/address/show:
 *  get:
 *      summary: show address of user by id
 *      tags: [Address]
 *      parameters:
 *          - in : query
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of address of which you want to delete
 *      responses:
 *          200:
 *              description: deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */
router.get('/',tokenVerify,checkRole(USER,SELLER),showAddress);
/**
 * @swagger
 * /api/v1/address/{id}:
 *  get:
 *      summary: get address by id 
 *      tags: [Address]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of address of which you want to edit
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/address'
 *      responses:
 *          200:
 *              description: this address
 *
 *          404:
 *              description : data doesnt found
 */
 router.get('/:id',tokenVerify,checkRole(USER,SELLER),validAddEdit,getAddress);

// router.get('/fetchcountry', showCountry);
module.exports = router;
