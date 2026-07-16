const { DataTypes } = require('sequelize');

// Deliberately stores only what's needed to display a saved card and let the
// buyer pick one at checkout - never a full card number or CVV. Once a real
// payment gateway is wired in, it tokenizes the card on its own end and
// hands back exactly this kind of display data (brand, last4, expiry) for
// us to store; the raw PAN never has to touch this server. Collecting it now
// "for later" would just be an unnecessary liability with nothing to show
// for it, since we don't have a gateway to charge it with yet.
module.exports = (sequelize) =>
  sequelize.define('PaymentMethod', {
    label: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'Card',
    },
    cardholderName: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    brand: {
      // Visa, Mastercard, Amex... user-entered for now, gateway-provided later.
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    last4: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    expMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
