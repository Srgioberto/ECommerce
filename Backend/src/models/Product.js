const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Product', {
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    image: {
      // Cover photo - always images[0] when a gallery exists. Uploaded photos
      // are stored as "/uploads/products/<timestamp>-<slug>.webp", which
      // comfortably exceeds the old 45-char limit meant for bare filenames.
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Full photo gallery, e.g. ["/uploads/products/...-1.webp", "...-2.webp"].
    // Legacy/seed products predating the gallery feature have this empty and
    // only `image` set.
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
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
