const Category = require('../models/Category');

const categoryService = {
  async getAll(filters = {}) {
    return await Category.findAll(filters);
  },

  async create(categoryData) {
    if (!categoryData.name) {
      throw new Error('Category name is required');
    }
    return await Category.create(categoryData.name);
  },

  async update(id, categoryData) {
    if (!categoryData.name) {
      throw new Error('Category name is required');
    }
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await Category.update(id, categoryData.name);
  },

  async toggle(id, currentStatus) {
    return await Category.toggleStatus(id, currentStatus);
  },

  async delete(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await Category.delete(id);
  }
};

module.exports = categoryService;