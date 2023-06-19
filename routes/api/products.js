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
    const {
      name,
      price,
      rating,
      category,
      categories,
      createdAt,
      createdBy,
      limit,
      skip,
      fields,
      sort,
    } = req.query;

    const filter = {};

    if (name) {
      filter.name = new RegExp('^' + name, 'i');
    }

    if (price) {
      filter.price = price;
    }

    if (rating) {
      filter.rating = rating;
    }

    if (category) {
      filter.categories = category;
    }

    if (categories && Array.isArray(categories) && categories.length > 0) {
      filter.categories = { $in: categories };
    }

    if (createdAt) {
      filter.createdAt = createdAt;
    }

    if (createdBy) {
      filter.createdBy = createdBy;
    }

    const parsedLimit = parseInt(limit, 10);
    const parsedSkip = parseInt(skip, 10);

    const result = await Products.list(
      filter,
      parsedLimit,
      parsedSkip,
      fields,
      sort,
    );

    res.status(200).json({ success: true, result: result });
  } catch (error) {
    next(error);
  }
});

// Get /api/products/tags
router.get('/categories', async (req, res) => {
  try {
    const dbCategories = await Products.distinct('categories'); // Obtener categorías de la base de datos

    const additionalCategories = [
      'Electronics',
      'Fashion',
      'Home and Garden',
      'Sports and Fitness',
      'Automotive',
      'Toys and Games',
      'Books and Magazines',
      'Beauty and Personal Care',
      'Arts and Crafts',
      'Music and Instruments',
      'Appliances',
      'Furniture',
      'Clothing and Accessories',
      'Shoes',
      'Jewelry and Watches',
      'Health and Wellness',
      'Musical Instruments',
      'Collectibles',
      'Consumer Electronics',
      'Computers and Accessories',
      'Phones and Accessories',
      'Cameras and Photography',
      'Video Games and Consoles',
      'Baby Items',
      'Pet Supplies',
      'Food and Beverages',
      'Office Supplies',
      'Tools and Home Improvement',
      'Travel and Experiences',
      'Services',
    ]; // Crear una lista de categorías adicionales

    const allCategories = [
      ...new Set([...dbCategories, ...additionalCategories]),
    ]; // Combinar los dos conjuntos de categorías eliminando duplicados

    res.status(200).json({ success: true, result: allCategories });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: 'Error retrieving categories' });
  }
});

/*
 * GET /api/v1/products/:id
 */

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

/*
 * POST /api/v1/products (body)
 */

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

    // Comprueba si el rol del usuario es "seller"
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Verifica si se proporcionaron categorías y las convierte en un array
    if (productData.categories) {
      productData.categories = productData.categories.split(',');
    }

    console.log(productData);
    const product = new Products(productData);
    const productCreated = await product.save();
    res.status(201).json({ result: productCreated });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id (body)
router.put('/:id', jwtAuth, async (req, res, next) => {
  try {
    const _id = req.params.id;
    const productData = req.body;
    const userId = req.user._id; // Obtén el ID del usuario autenticado

    // Verificar si el usuario autenticado es el creador del producto
    const product = await Products.findOne({ _id: _id, createdBy: userId });

    if (!product) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updateProduct = await Products.findOneAndUpdate(
      { _id: _id },
      productData,
      {
        new: true,
        useFindAndModify: false,
      },
    );
    // usamos { new: true } para que nos devuelva el producto actualizado

    res.json({ result: updateProduct });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id
router.delete('/:id', jwtAuth, async (req, res, next) => {
  try {
    const _id = req.params.id;

    // Obtén el producto por su ID
    const product = await Products.findOne({ _id });

    // Comprueba si el producto existe
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Verifica si el usuario autenticado es el creador del producto
    if (product.createdBy !== req.user._id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Borra el producto
    await Products.deleteOne({ _id });

    res.status(201).json({ result: 'Deleted product' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
