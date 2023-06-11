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
  images: {
    type: Array,
    required: true,
    validate: {
      validator: function (images) {
        // Verificar si el valor es un array
        if (!Array.isArray(images)) {
          throw new Error('Images must be an array');
        }

        // Verificar cada elemento del array
        for (let i = 0; i < images.length; i++) {
          const image = images[i];

          // Verificar si el elemento no es una cadena de texto
          if (typeof image !== 'string') {
            throw new Error('Invalid image format');
          }

          // Verificar si la cadena de texto no corresponde a una extensión de imagen permitida
          const allowedExtensions = ['.jpg', '.jpeg', '.png'];
          const fileExtension = image
            .substring(image.lastIndexOf('.'))
            .toLowerCase();
          if (!allowedExtensions.includes(fileExtension)) {
            throw new Error('Invalid image extension');
          }
        }

        // Todas las imágenes son válidas
        return true;
      },
      message: 'Invalid image format',
    },
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  categories: {
    type: Array,
    required: true,
  },
});

const Products = mongoose.model('Product', productsSchema);

module.exports = Products;
