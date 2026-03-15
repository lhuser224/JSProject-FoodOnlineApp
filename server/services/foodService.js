const Food = require('../models/foodModel');

const createFood = async (data) => {
    return await Food.insert(data);
};

module.exports = { createFood };