const jwt = require('jsonwebtoken');
const userService = require('../services/user');
const isAdmin = async (req, res, next) => {
  console.log('req.session.jwt', req.session.jwt);
  try {
    if (!req.session?.jwt) {
      throw new Error('authentication is required');
    }

    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
    const user = await userService.findById(payload.id);
    if (user.admin !== 1) {
      throw new Error('only admins can access this route');
    }
    console.log('user is admin');
    next();
  } catch (err) {
    return res
      .status(403)
      .send({ error: err.message || 'only admins can access this route' });
  }
};

module.exports = { isAdmin };
