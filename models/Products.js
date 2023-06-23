'use strict';

const mongoose = require('mongoose');

// esquema

const productsSchema = mongoose.Schema(
  {
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
      index: true,
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
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },
    categories: {
      type: [String],
      required: true,
      index: true,
    },
    createdBy: {
      type: String,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    creatorCompany: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    collection: 'products',
  },
);

productsSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.name = capitalizeFirstLetter(this.name);
  }
  if (this.isModified('description')) {
    this.description = capitalizeFirstLetter(this.description);
  }
  if (this.isModified('creatorCompany')) {
    this.creatorCompany = capitalizeFirstLetter(this.creatorCompany);
  }
  next();
});

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

productsSchema.statics.list = function (filter, limit, skip, fields, sort) {
  const query = Products.find(filter);

  // Validar y aplicar límite y salto
  if (typeof limit === 'number' && limit >= 0) {
    query.limit(limit);
  }

  if (typeof skip === 'number' && skip >= 0) {
    query.skip(skip);
  }

  // Validar y aplicar campos seleccionados
  if (fields) {
    query.select(fields);
  }

  // Validar y aplicar ordenamiento
  if (sort) {
    query.sort(sort);
  }

  // Ejecutar consulta y manejar errores
  try {
    return query.exec();
  } catch (error) {
    throw new Error('Error executing query: ' + error.message);
  }
};

const Products = mongoose.model('Product', productsSchema);

module.exports = Products;
