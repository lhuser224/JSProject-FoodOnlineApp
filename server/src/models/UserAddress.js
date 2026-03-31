const db = require('../config/db');

const UserAddress = {
  async findByUserId(userId) {
    const [rows] = await db.query(
      'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC', 
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM user_addresses WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    const [result] = await db.query(
      'INSERT INTO user_addresses (user_id, receiver_name, receiver_phone, province, district, ward, address_detail, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.user_id, data.receiver_name, data.receiver_phone, data.province, data.district, data.ward, data.address_detail, data.is_default || 0]
    );
    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    await db.query(
      'UPDATE user_addresses SET receiver_name = ?, receiver_phone = ?, province = ?, district = ?, ward = ?, address_detail = ? WHERE id = ?',
      [data.receiver_name, data.receiver_phone, data.province, data.district, data.ward, data.address_detail, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    await db.query('DELETE FROM user_addresses WHERE id = ?', [id]);
    return { success: true };
  },

  async updateDefault(userId, addressId) {
    await db.query('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    await db.query('UPDATE user_addresses SET is_default = 1 WHERE id = ?', [addressId]);
    return { success: true };
  }
};

module.exports = UserAddress;