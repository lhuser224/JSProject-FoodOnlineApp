const db = require('../config/db');

const Food = {
    getByShopId: (shopId) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM foods WHERE shop_id = ?";
            db.query(sql, [shopId], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    },
    
    insert: (foodData) => {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO foods (name, price, image_url, shop_id, category_id, status) VALUES (?, ?, ?, ?, ?, 'available')";
            const params = [foodData.name, foodData.price, foodData.image_url, foodData.shop_id, foodData.category_id];
            
            db.query(sql, params, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = Food;