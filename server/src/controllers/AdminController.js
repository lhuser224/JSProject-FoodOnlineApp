const shopService = require('../services/shopService');
const categoryService = require('../services/categoryService');

const adminController = {
  async getPendingShops(req, res) {
    try {
      const shops = await shopService.getAll({ is_active: false });
      res.status(200).json({ success: true, data: shops });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async approveShop(req, res) {
    try {
      const { id } = req.params;
      const result = await shopService.approve(parseInt(id));
      res.status(200).json({ success: true, message: 'Shop approved successfully', data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getCategories(req, res) {
    try {
      const result = await categoryService.getAll();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async createCategory(req, res) {
    try {
      const result = await categoryService.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async toggleCategory(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body; 
      const result = await categoryService.toggle(id, is_active);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await categoryService.delete(id);
      res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = adminController;