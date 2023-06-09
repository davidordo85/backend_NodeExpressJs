'use strict';

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // recoger el jwtToken de la cabecera (o de otros sitios)
  const jwtToken =
    req.get('Authorization') || req.query.token || req.body.token;

  const token = jwtToken?.split(' ')[1] ?? req.query.token ?? req.body.token;

  // comprobar que tengo token
  if (!token) {
    const error = new Error('no token provided');
    error.status = 401;
    next(error);
    return;
  }

  // Comprobar que el token es válido
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    console.log(jwtToken);
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        const error = new Error('Token expired');
        error.status = 401;
        return next(error);
      }

      const error = new Error('Invalid token');
      error.status = 401;
      return next(error);
    }
    req.apiAuthUserId = payload._id;
    next();
  });
};
