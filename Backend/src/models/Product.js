const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Product', {
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    image: {
      // Uploaded photos are stored as "/uploads/products/<timestamp>-<slug>.webp",
      // which comfortably exceeds the old 45-char limit meant for bare filenames.
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Per-size stock, e.g. [{ size: "40", stock: 5 }, { size: "41", stock: 0 }].
    // `stock` above is kept as the total across sizes for backwards compatibility
    // with the rest of the stock-checking logic.
    sizes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  });
