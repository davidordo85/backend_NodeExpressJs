'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

const Products = require('../../models/Products');

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

module.exports = router;
