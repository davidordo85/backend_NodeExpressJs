const bcrypt = require('bcrypt');

const validatePassword = password => {
  if (password.length < 8) {
    throw new Error('Password should be at least 8 characters long');
  }
};

const hashPassword = async password => {
  validatePassword(password);

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePassword = (passwordClear, hashedPassword) => {
  return bcrypt.compare(passwordClear, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
