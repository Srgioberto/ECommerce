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
      unique: true,
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
