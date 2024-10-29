const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Cart', {
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
