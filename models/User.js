'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

userSchema.path('email').validate(function (value) {
  // Agrega una validación de formato para el campo de correo electrónico
  // Puedes personalizar esta expresión regular según tus necesidades
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}, 'Invalid email format');

const validatePassword = password => {
  // Agrega aquí tu lógica de validación de contraseña
  // Por ejemplo, verifica si cumple con ciertos requisitos mínimos
  if (password.length < 8) {
    throw new Error('Password should be at least 8 characters long');
  }
};

userSchema.statics.hashPassword = async function (password) {
  validatePassword(password); // Valida la contraseña antes de aplicar el hash

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

userSchema.methods.comparePassword = function (passwordClear) {
  return bcrypt.compare(passwordClear, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
