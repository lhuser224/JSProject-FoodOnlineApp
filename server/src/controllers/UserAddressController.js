const userAddressService = require('../services/UserAddressService');

const userAddressController = {
  async getAll(req, res) {
    try {
      const result = await userAddressService.getAll(req.user.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const result = await userAddressService.create(req.user.id, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const result = await userAddressService.update(req.user.id, req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await userAddressService.delete(req.user.id, req.params.id);
      res.status(200).json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async setDefault(req, res) {
    try {
      const result = await userAddressService.setDefault(req.user.id, req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = userAddressController;