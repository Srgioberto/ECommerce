const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Address', {
    label: {
      // Short name the user picks for this address ("Home", "Work"...)
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'Address',
    },
    fullName: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    address1: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
