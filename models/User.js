'use strict';

const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

const userSchema = mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  birthdate: { type: Date, required: true },
  role: {
    type: String,
    enum: ['user', 'seller'],
    default: 'user',
  },
  companyName: {
    type: String,
    required: function () {
      return this.role === 'seller';
    },
  },
});

userSchema.path('email').validate(function (value) {
  // Agrega una validación de formato para el campo de correo electrónico
  // Puedes personalizar esta expresión regular según tus necesidades
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}, 'Invalid email format');

userSchema.path('name').validate(function (value) {
  if (!value || value.trim().length === 0) {
    throw new Error('Name is required');
  }
});

userSchema.path('birthdate').validate(function (value) {
  if (!value) {
    throw new Error('Birthdate is required');
  }

  // Calcular la edad mínima requerida (18 años)
  const minimumAge = new Date();
  minimumAge.setFullYear(minimumAge.getFullYear() - 18);

  if (value > minimumAge) {
    throw new Error('You must be at least 18 years old');
  }
});

userSchema.statics.hashPassword = async function (password) {
  const hashedPassword = await hashPassword(password);
  return hashedPassword;
};

userSchema.methods.comparePassword = function (passwordClear) {
  return comparePassword(passwordClear, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
