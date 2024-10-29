const bcrypt = require('bcrypt');
const { User } = require('../config');
const cartService = require('./cart');
class UserService {
  async createUser(userData) {
    // Hash the password before saving
    const emailAlreadyExist = await User.findOne({
      where: { email: userData.email },
    });
    if (emailAlreadyExist) {
      throw new Error('email is already in use');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = User.build({
      ...userData,
      admin: 0,
      password: hashedPassword,
    });
    await user.save();
    delete user.password;

    // TODO move this to 'on create' hook/trigger
    await cartService.createCart(user.id);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      admin: !!user.admin,
    };
  }

  async loginUser({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    // Check if password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      admin: !!user.admin,
    };
  }

  async findById(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('user not found');
    }
    delete user.password;
    return user;
  }
}

module.exports = new UserService();
