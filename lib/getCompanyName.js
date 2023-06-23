const { User } = require('../models');

// Middleware para obtener el nombre de la empresa asociada al usuario
module.exports = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const companyName = user.companyName;
    req.companyName = companyName;

    next();
  } catch (error) {
    next(error);
  }
};
