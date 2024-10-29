const jwt = require('jsonwebtoken');

const currentUser = (req, res, next) => {
  console.log('req.session.jwt', req.session.jwt);
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
    console.log('payload', payload);
    req.currentUser = payload;
  } catch (err) {}

  next();
};

module.exports = { currentUser };
