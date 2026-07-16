const { Address } = require('../config');

class AddressService {
  async list(userId) {
    return Address.findAll({ where: { UserId: userId }, order: [['id', 'ASC']] });
  }

  async create(userId, data) {
    if (data.isDefault) {
      await Address.update({ isDefault: false }, { where: { UserId: userId } });
    }
    const address = await Address.create({
      label: data.label || 'Address',
      fullName: data.fullName,
      phone: data.phone,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      province: data.province,
      country: data.country,
      isDefault: !!data.isDefault,
      UserId: userId,
    });
    return address;
  }

  async update(userId, id, data) {
    const address = await Address.findOne({ where: { id, UserId: userId } });
    if (!address) {
      throw new Error('Address not found');
    }
    if (data.isDefault) {
      await Address.update({ isDefault: false }, { where: { UserId: userId } });
    }
    await address.update({
      label: data.label ?? address.label,
      fullName: data.fullName ?? address.fullName,
      phone: data.phone ?? address.phone,
      address1: data.address1 ?? address.address1,
      address2: data.address2 ?? address.address2,
      city: data.city ?? address.city,
      province: data.province ?? address.province,
      country: data.country ?? address.country,
      isDefault: data.isDefault ?? address.isDefault,
    });
    return address;
  }

  async remove(userId, id) {
    const address = await Address.findOne({ where: { id, UserId: userId } });
    if (!address) {
      throw new Error('Address not found');
    }
    await address.destroy();
  }
}

module.exports = new AddressService();
