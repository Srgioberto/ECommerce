const requireAuth = (req, res, next) => {
  if (!req.currentUser) {
    return res.status(401);
  }

  next();
};

module.exports = { requireAuth };
