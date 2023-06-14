const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  // Recoger el jwtToken de la cabecera (o de otros sitios)
  const jwtToken =
    req.get('Authorization') || req.query.token || req.body.token;

  const token = jwtToken?.split(' ')[1] ?? req.query.token ?? req.body.token;

  // Comprobar que tengo token
  if (!token) {
    const error = new Error('No token provided');
    error.status = 401;
    return next(error);
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener el ID del usuario y el rol del token decodificado
    const { _id, role } = decoded;

    // Verificar si el usuario existe en la base de datos
    const user = await User.findById(_id);

    if (!user) {
      const error = new Error('User not found');
      error.status = 401;
      return next(error);
    }

    // Agregar el ID del usuario y el rol al objeto `req` para su uso posterior
    req.apiAuthUserId = _id;
    req.role = role;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      const error = new Error('Token expired');
      error.status = 401;
      return next(error);
    }

    const error = new Error('Invalid token');
    error.status = 401;
    return next(error);
  }
};
