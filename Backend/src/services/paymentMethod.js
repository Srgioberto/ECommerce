const { PaymentMethod } = require('../config');

const CARD_NUMBER_LIKE = /^\d{6,}$/;

class PaymentMethodService {
  async list(userId) {
    return PaymentMethod.findAll({ where: { UserId: userId }, order: [['id', 'ASC']] });
  }

  async create(userId, data) {
    this.assertNotRawCardNumber(data.last4);
    if (data.isDefault) {
      await PaymentMethod.update({ isDefault: false }, { where: { UserId: userId } });
    }
    const paymentMethod = await PaymentMethod.create({
      label: data.label || 'Card',
      cardholderName: data.cardholderName,
      brand: data.brand,
      last4: data.last4,
      expMonth: parseInt(data.expMonth, 10),
      expYear: parseInt(data.expYear, 10),
      isDefault: !!data.isDefault,
      UserId: userId,
    });
    return paymentMethod;
  }

  async update(userId, id, data) {
    const paymentMethod = await PaymentMethod.findOne({ where: { id, UserId: userId } });
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }
    if (data.last4) this.assertNotRawCardNumber(data.last4);
    if (data.isDefault) {
      await PaymentMethod.update({ isDefault: false }, { where: { UserId: userId } });
    }
    await paymentMethod.update({
      label: data.label ?? paymentMethod.label,
      cardholderName: data.cardholderName ?? paymentMethod.cardholderName,
      brand: data.brand ?? paymentMethod.brand,
      last4: data.last4 ?? paymentMethod.last4,
      expMonth: data.expMonth ? parseInt(data.expMonth, 10) : paymentMethod.expMonth,
      expYear: data.expYear ? parseInt(data.expYear, 10) : paymentMethod.expYear,
      isDefault: data.isDefault ?? paymentMethod.isDefault,
    });
    return paymentMethod;
  }

  async remove(userId, id) {
    const paymentMethod = await PaymentMethod.findOne({ where: { id, UserId: userId } });
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }
    await paymentMethod.destroy();
  }

  // This form only ever asks for the last 4 digits, but guard against a
  // pasted-in full card number anyway - we have nowhere safe to put it.
  assertNotRawCardNumber(last4) {
    if (CARD_NUMBER_LIKE.test(String(last4))) {
      throw new Error('Enter only the last 4 digits, not the full card number');
    }
  }
}

module.exports = new PaymentMethodService();
