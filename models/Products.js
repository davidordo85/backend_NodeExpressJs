'use strict';

const mongoose = require('mongoose');

// esquema

const productsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    unique: true,
    index: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
    validate: {
      validator: function (value) {
        // Aquí puedes realizar validaciones personalizadas adicionales si es necesario
        // Por ejemplo, validar que el precio tenga un formato específico o cumpla ciertas condiciones.
        return value >= 0 && value <= 10000;
      },
      message: 'The price must be between 0 and 10000.',
    },
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer.',
    },
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  image: {
    type: Array,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  category: {
    type: Array,
    required: true,
  },
});

const Products = mongoose.model('Product', productsSchema);

module.exports = Products;
