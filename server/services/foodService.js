const Food = require('../models/foodModel');

const createFood = async (data) => {
    // Không cần xử lý nhiều, gọi thẳng Model
    return await Food.insert(data);
};

module.exports = { createFood };