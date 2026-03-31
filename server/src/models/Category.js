const db = require('../config/db');

const Category = {
  async findAll(filters = {}) {
    let query = 'SELECT * FROM categories';
    const queryParams = [];

    // Kiểm tra nếu có lọc theo trạng thái hoạt động
    if (filters.is_active !== undefined) {
      query += ' WHERE is_active = ?';
      queryParams.push(filters.is_active);
    }

    query += ' ORDER BY id DESC';
    const [rows] = await db.query(query, queryParams);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(name) {
    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return { id: result.insertId, name, is_active: true };
  },

  async update(id, name) {
    await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    return { id, name };
  },

  async toggleStatus(id, currentStatus) {
    const newStatus = !currentStatus;
    await db.query('UPDATE categories SET is_active = ? WHERE id = ?', [newStatus, id]);
    return { id, is_active: newStatus };
  },

  async delete(id) {
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return { id };
  }
};

module.exports = Category;