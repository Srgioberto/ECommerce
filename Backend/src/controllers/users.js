const jwt = require('jsonwebtoken');

const userService = require('../services/user');

const registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY
    );

    // Store it on session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await userService.loginUser(req.body);
    // Generate JWT
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY
    );

    // Store it on session object
    req.session = { jwt: userJwt };
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

module.exports = { registerUser, loginUser };
