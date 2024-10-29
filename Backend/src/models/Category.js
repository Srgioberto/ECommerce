const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Category', {
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  });
