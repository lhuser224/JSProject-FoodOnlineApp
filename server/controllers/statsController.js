const db = require('../config/db');

/**
 * Get dashboard statistics
 */
exports.getStats = async (req, res) => {
    try {
        // Total users
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
        
        // Total shops
        const [shopCount] = await db.query('SELECT COUNT(*) as count FROM shops');
        
        // Total orders
        const [orderCount] = await db.query('SELECT COUNT(*) as count FROM orders');
        
        // Total revenue
        const [revenue] = await db.query('SELECT SUM(total_price) as total FROM orders WHERE status = "completed"');
        
        // Active shops
        const [activeShops] = await db.query('SELECT COUNT(*) as count FROM shops WHERE is_active = true');

        res.json({
            total_users: userCount[0].count,
            total_shops: shopCount[0].count,
            total_orders: orderCount[0].count,
            total_revenue: revenue[0].total || 0,
            active_shops: activeShops[0].count
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
};

/**
 * Get order statistics for shop
 */
exports.getShopStats = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Total orders
        const [orderCount] = await db.query(
            'SELECT COUNT(*) as count FROM orders WHERE shop_id = ?',
            [shopId]
        );

        // Revenue
        const [revenue] = await db.query(
            'SELECT SUM(total_price) as total FROM orders WHERE shop_id = ? AND status = "completed"',
            [shopId]
        );

        // Orders by status
        const [ordersByStatus] = await db.query(
            'SELECT status, COUNT(*) as count FROM orders WHERE shop_id = ? GROUP BY status',
            [shopId]
        );

        res.json({
            total_orders: orderCount[0].count,
            total_revenue: revenue[0].total || 0,
            orders_by_status: ordersByStatus
        });
    } catch (error) {
        console.error('Error fetching shop stats:', error);
        res.status(500).json({ message: 'Error fetching shop statistics' });
    }
};

/**
 * Get user statistics for dashboard
 */
exports.getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;

        // Total orders
        const [orderCount] = await db.query(
            'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
            [userId]
        );

        // Total spent
        const [totalSpent] = await db.query(
            'SELECT SUM(total_price) as total FROM orders WHERE user_id = ? AND status = "completed"',
            [userId]
        );

        // Recent orders
        const [recentOrders] = await db.query(
            'SELECT id, total_price, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
            [userId]
        );

        res.json({
            total_orders: orderCount[0].count,
            total_spent: totalSpent[0].total || 0,
            recent_orders: recentOrders
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Error fetching user statistics' });
    }
};
