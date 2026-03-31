const optionGroupService = require('../services/OptionGroupService');
const optionItemService = require('../services/OptionItemService');
const foodOptionService = require('../services/FoodOptionService');

const optionController = {
  async createGroup(req, res) {
    try {
      const group = await optionGroupService.create(req.body);
      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async addItem(req, res) {
    try {
      const item = await optionItemService.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getGroupsByShop(req, res) {
    try {
      const groups = await optionGroupService.getByShop(req.params.shopId);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getFoodCustomization(req, res) {
    try {
      const customization = await foodOptionService.getFullCustomization(req.params.foodId);
      res.json(customization);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async assignToFood(req, res) {
    try {
      const { foodId, groupId } = req.body;
      await foodOptionService.assignGroup(foodId, groupId);
      res.json({ message: 'Assigned successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async removeFromFood(req, res) {
    try {
      const { foodId, groupId } = req.body;
      await foodOptionService.removeGroup(foodId, groupId);
      res.json({ message: 'Removed successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = optionController;