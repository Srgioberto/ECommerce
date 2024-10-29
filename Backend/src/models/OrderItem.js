const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('OrderItem', {
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
