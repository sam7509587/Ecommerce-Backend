const express = require('express');
const router = express.Router();
const {
  createAddress,
  editAddress,
  deleteAddress,
  showAddress,
  showCountry,
} = require('../controller');
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
 *                  fullName :
 *                      type : string
 *                  phoneNumber :
 *                      type : string
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
 *                  fullName : "sameer"
 *                  phoneNumber : "7509587122"
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
 * /api/v1/address/register:
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
 *         description: The Seller was successfully registered
 *       500:
 *         description: Some server error
 */
router.post('/register', createAddress);

/**
 * @swagger
 * /api/v1/address/edit:
 *  patch:
 *      summary: edit users address
 *      tags: [Address]
 *      parameters:
 *          - in : query
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
 *              description: this is the list of seller
 *
 *          404:
 *              description : data doesnt found
 */
router.patch('/edit', editAddress);

/**
 * @swagger
 * /api/v1/address/delete:
 *  delete:
 *      summary: delete address by id
 *      tags: [Address]
 *      parameters:
 *          - in : query
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of address of which you want to delete
 *      responses:
 *          200:
 *              description: this is the list of seller
 *
 *          404:
 *              description : data doesnt found
 */
router.delete('/delete',deleteAddress);
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
 *              description: this is the list of seller
 *
 *          404:
 *              description : data doesnt found
 */
router.get('/show', showAddress);

router.get('/fetchcountry', showCountry);
module.exports = router;
