const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      // Named explicitly so sync({ alter: true }) recognizes the existing
      // constraint across dev-server restarts instead of adding a new
      // uniquely-named index each time (MySQL caps a table at 64 keys).
      unique: 'users_email_unique',
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    admin: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
  });

  User.addHook('afterCreate', async (user) => {
    // required lazily: services/cart requires config/index, which requires this
    // file, so a top-level require here would create a circular dependency.
    const cartService = require('../services/cart');
    await cartService.createCart(user.id);
  });

  //
  // example to check add methods. Not in use now but may be useful in the future
  // // Adding a class level method
  // User.classLevelMethod = function () {
  //   return 'foo';
  // };
  // // Adding an instance level method
  // User.prototype.instanceLevelMethod = function () {
  //   return 'bar';
  // };
  //
  return User;
};
