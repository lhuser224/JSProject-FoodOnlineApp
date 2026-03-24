const categoryService = require('../services/categoryService');

const categoryController = {
  async getAll(req, res) {
    try {
      const result = await categoryService.getAll();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      const result = await categoryService.create({ name });
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const result = await categoryService.update(parseInt(id), { name });
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      const result = await categoryService.toggle(id, is_active);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await categoryService.delete(parseInt(id));
      res.status(200).json({
        success: true,
        message: 'Deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = categoryController;