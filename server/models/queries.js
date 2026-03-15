const db = require('../config/db');

/**
 * User queries
 */
exports.getUserById = async (id) => {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return users[0] || null;
};

exports.getUserByPhone = async (phone) => {
    const [users] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    return users[0] || null;
};

/**
 * Food queries
 */
exports.getFoodById = async (id) => {
    const [foods] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
    return foods[0] || null;
};

exports.getFoodsByShop = async (shopId) => {
    const [foods] = await db.query('SELECT * FROM foods WHERE shop_id = ?', [shopId]);
    return foods;
};

exports.searchFoods = async (query) => {
    const searchTerm = `%${query}%`;
    const [foods] = await db.query('SELECT * FROM foods WHERE name LIKE ? OR id IN (SELECT food_id FROM foods WHERE id IN (SELECT id FROM foods f JOIN categories c ON f.category_id = c.id WHERE c.name LIKE ?))', [searchTerm, searchTerm]);
    return foods;
};

/**
 * Order queries
 */
exports.getOrderById = async (id) => {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    return orders[0] || null;
};

exports.getOrdersByUser = async (userId) => {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return orders;
};

exports.getOrdersByShop = async (shopId) => {
    const [orders] = await db.query('SELECT * FROM orders WHERE shop_id = ? ORDER BY created_at DESC', [shopId]);
    return orders;
};

exports.getOrderItems = async (orderId) => {
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return items;
};

/**
 * Shop queries
 */
exports.getShopById = async (id) => {
    const [shops] = await db.query('SELECT * FROM shops WHERE id = ?', [id]);
    return shops[0] || null;
};

exports.getShopByUserId = async (userId) => {
    const [shops] = await db.query('SELECT * FROM shops WHERE user_id = ?', [userId]);
    return shops[0] || null;
};

/**
 * Category queries
 */
exports.getAllCategories = async () => {
    const [categories] = await db.query('SELECT * FROM categories');
    return categories;
};

/**
 * Cart queries
 */
exports.getCartItems = async (userId) => {
    const [items] = await db.query('SELECT * FROM cart_items WHERE user_id = ?', [userId]);
    return items;
};

exports.addToCart = async (userId, foodId, quantity, selectedOptions) => {
    const [result] = await db.query(
        'INSERT INTO cart_items (user_id, food_id, quantity, selected_options) VALUES (?, ?, ?, ?)',
        [userId, foodId, quantity, JSON.stringify(selectedOptions)]
    );
    return result.insertId;
};

exports.removeFromCart = async (cartItemId) => {
    await db.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
};

exports.clearCart = async (userId) => {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
};
