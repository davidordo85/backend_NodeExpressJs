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

    // Mapear las fotos de los productos a su URL en la carpeta pública
    const productsWithPhotoURLs = result.map(product => {
      const photoURL = `../../public/images/${product.photoFileName}`; // Ruta a la carpeta pública y el nombre de la foto del producto
      return {
        ...product.toObject(),
        photoURL,
      };
    });

    res.status(200).json({ success: true, result: productsWithPhotoURLs });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
