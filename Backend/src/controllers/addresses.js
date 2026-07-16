const addressService = require('../services/address');

const listAddresses = async (req, res) => {
  try {
    const addresses = await addressService.list(req.currentUser.id);
    res.status(200).send(addresses);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

const createAddress = async (req, res) => {
  try {
    const address = await addressService.create(req.currentUser.id, req.body);
    res.status(201).send(address);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await addressService.update(req.currentUser.id, req.params.id, req.body);
    res.status(200).send(address);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await addressService.remove(req.currentUser.id, req.params.id);
    res.status(200).send({ id: parseInt(req.params.id, 10) });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { listAddresses, createAddress, updateAddress, deleteAddress };
