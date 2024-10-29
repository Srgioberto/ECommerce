const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Order', {
    status: {
      type: DataTypes.ENUM,
      //Confirmed: the order has been created, Processing: the shop is preparing the order to ship it
      //Shipped: the order has been sent to the given address, Delivered: the order has reached the destination and recepted by a person.
      //Canceled: the order has been canceled
      values: ['confirmed', 'processing', 'shipped', 'delivered', 'canceled'],
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    //Name of the street
    address1: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    //Number or Letter of the house,appartment,etc.
    address2: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  });
