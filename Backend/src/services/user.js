const bcrypt = require('bcrypt');
const { User } = require('../config');
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
    // Public registration never grants admin access - existing admins
    // promote other accounts from the admin panel (see setUserAdmin below).
    const user = User.build({
      ...userData,
      admin: 0,
      password: hashedPassword,
    });
    await user.save();
    delete user.password;

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

  async findAll() {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'admin'],
      order: [['id', 'ASC']],
    });
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      admin: !!user.admin,
    }));
  }

  async setUserAdmin(id, admin, requestingUserId) {
    if (parseInt(id, 10) === requestingUserId && !admin) {
      throw new Error('You cannot remove your own admin access');
    }
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('user not found');
    }
    user.admin = admin ? 1 : 0;
    await user.save();
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      admin: !!user.admin,
    };
  }
}

module.exports = new UserService();
