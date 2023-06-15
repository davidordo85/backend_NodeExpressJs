'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
const multer = require('multer');
const jwtAuth = require('../../lib/jwtAuth');

const Products = require('../../models/Products');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage });

/*
 * GET /api/v1/products
 */

router.get('/', async function (req, res, next) {
  try {
    const result = await Products.find();

    res.status(200).json({ success: true, result: result });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;
    const product = await Products.findOne({ _id: _id });

    if (!product) {
      return res.status(404).json({ error: 'not found' });
    }
    res.status(201).json({ success: true, result: product });
  } catch (err) {
    next(err);
  }
});

router.post('/', jwtAuth, upload.array('images'), async (req, res, next) => {
  try {
    const productData = req.body;
    const images = req.files.map(file => file.filename); // Array con los nombres de las imágenes

    // Agrega el array de nombres de imágenes al objeto productData
    productData.images = images;

    // Agrega el ID del usuario autenticado como creador del producto
    productData.createdBy = req.user._id;

    // Agrega la fecha de creación actual como createdAt
    productData.createdAt = new Date();

    console.log(productData);
    const product = new Products(productData);
    const productCreated = await product.save();
    res.status(201).json({ result: productCreated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
