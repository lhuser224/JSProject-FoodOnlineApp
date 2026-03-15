const db = require('../config/db');

/**
 * Create new order
 */
exports.createOrder = async (req, res) => {
    try {
        const { user_id, shop_id, total_price, items } = req.body;

        if (!user_id || !shop_id || !items || items.length === 0) {
            return res.status(400).json({ message: 'user_id, shop_id, and items are required' });
        }

        // Insert order
        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, shop_id, total_price, status) VALUES (?, ?, ?, ?)',
            [user_id, shop_id, total_price, 'pending']
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            await db.query(
                'INSERT INTO order_items (order_id, food_id, quantity, base_price, total_price, selected_options) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.food_id, item.quantity, item.base_price || item.price, item.total_price || (item.quantity * (item.price || 0)), JSON.stringify(item.selected_options || {})]
            );
        }

        res.status(201).json({
            order_id: orderId,
            user_id,
            shop_id,
            total_price,
            status: 'pending',
            created_at: new Date()
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

/**
 * Get order history for user
 */
exports.getOrderHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const [orders] = await db.query(
            'SELECT id, total_price, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ message: 'Error fetching order history' });
    }
};

/**
 * Get order by ID with items
 */
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const [orders] = await db.query(
            'SELECT * FROM orders WHERE id = ?',
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const [items] = await db.query(
            'SELECT * FROM order_items WHERE order_id = ?',
            [orderId]
        );

        res.json({
            ...orders[0],
            items
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
};

/**
 * Update order status
 */
exports.updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
        );

        res.json({ message: 'Order updated', status });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order' });
    }
};

/**
 * Cancel order
 */
exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const [orders] = await db.query(
            'SELECT status FROM orders WHERE id = ?',
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (orders[0].status !== 'pending') {
            return res.status(400).json({ message: 'Can only cancel pending orders' });
        }

        await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['cancelled', orderId]
        );

        res.json({ message: 'Order cancelled' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Error cancelling order' });
    }
};
