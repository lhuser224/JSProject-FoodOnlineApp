const db = require('../config/db');

const Order = {
  async create(orderData) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const { user_id, shop_id, total_price, items } = orderData;

      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, shop_id, total_price, status) VALUES (?, ?, ?, ?)',
        [user_id, shop_id, total_price, 'pending']
      );

      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, food_id, quantity, base_price, total_price, selected_options) VALUES (?, ?, ?, ?, ?, ?)',
          [
            orderId,
            item.food_id,
            item.quantity,
            item.base_price || item.price,
            item.total_price || (item.quantity * (item.price || 0)),
            typeof item.selected_options === 'object' 
              ? JSON.stringify(item.selected_options) 
              : item.selected_options || '{}'
          ]
        );
      }

      await connection.commit();
      return { id: orderId, status: 'pending' };
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  async findById(id) {
    const query = `
      SELECT o.*, s.shop_name, 
             ua.receiver_name, ua.receiver_phone, ua.address_detail,
             ua.province, ua.district, ua.ward
      FROM orders o
      JOIN shops s ON o.shop_id = s.id
      LEFT JOIN user_addresses ua ON o.user_id = ua.user_id AND ua.is_default = 1
      WHERE o.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  },

  async getItems(orderId) {
    const query = `
      SELECT oi.*, f.name as food_name, f.image_url 
      FROM order_items oi
      JOIN foods f ON oi.food_id = f.id
      WHERE oi.order_id = ?
    `;
    const [rows] = await db.query(query, [orderId]);
    
    return rows.map(item => ({
      ...item,
      selected_options: typeof item.selected_options === 'string' 
        ? JSON.parse(item.selected_options) 
        : item.selected_options
    }));
  },

  async findByUserId(userId, filters = {}) {
    let query = `
      SELECT o.*, s.shop_name 
      FROM orders o 
      JOIN shops s ON o.shop_id = s.id 
      WHERE o.user_id = ?
    `;
    const params = [userId];
    if (filters.status && filters.status !== 'all') {
      query += ' AND o.status = ?';
      params.push(filters.status);
    }
    query += ' ORDER BY o.created_at DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  async updateStatus(id, status) {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  },

  async cancel(id) {
    const order = await this.findById(id);
    if (!order) throw new Error('Order not found');
    if (order.status.toLowerCase() !== 'pending') {
      throw new Error('Cannot cancel order');
    }
    return this.updateStatus(id, 'cancelled');
  }
};

module.exports = Order;