const requireAuth = (req, res, next) => {
  if (!req.currentUser) {
    return res.status(401).send({ error: 'authentication is required' });
  }

  next();
};

module.exports = { requireAuth };
