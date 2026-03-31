const db = require('../config/db');

const Food = {
  findByShop: async (shopId) => {
    return await Food.findAll({ shopId });
  },

  findByCategory: async (categoryId) => {
    return await Food.findAll({ categoryId });
  },

  findAll: async (filters = {}) => {
      let query = `
        SELECT f.*, s.shop_name, s.shop_address, s.ward, s.district, s.province, s.image_url as shop_image
        FROM foods f
        JOIN shops s ON f.shop_id = s.id
        WHERE 1=1`;
      
      const params = [];

      // 1. Lọc theo trạng thái Shop
      if (filters.isOpen !== 'all') {
        const isOpenStatus = filters.isOpen !== undefined ? filters.isOpen : true;
        query += ' AND s.is_open = ?';
        params.push(isOpenStatus);
      }

      // 2. Lọc trạng thái món ăn
      if (filters.status) {
        query += ' AND f.status = ?';
        params.push(filters.status);
      } else {
        query += ' AND f.status != "hidden"';
      }

      // 3. XỬ LÝ LỌC NHIỀU CATEGORY ID (CRITICAL FIX)
      if (filters.category_ids) {
        let catIds = [];
        if (typeof filters.category_ids === 'string') {
          catIds = filters.category_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        } else if (Array.isArray(filters.category_ids)) {
          catIds = filters.category_ids;
        }

        if (catIds.length > 0) {
          const placeholders = catIds.map(() => '?').join(',');
          query += ` AND f.category_id IN (${placeholders})`;
          params.push(...catIds);
        }
      } else if (filters.categoryId) {
        query += ' AND f.category_id = ?';
        params.push(filters.categoryId);
      }

      // 4. Tìm kiếm & Giá
      if (filters.search) {
        query += ' AND f.name LIKE ?';
        params.push(`%${filters.search}%`);
      }

      if (filters.minPrice) {
        query += ' AND f.price >= ?';
        params.push(Number(filters.minPrice));
      }

      if (filters.maxPrice) {
        query += ' AND f.price <= ?';
        params.push(Number(filters.maxPrice));
      }

      // 5. Sắp xếp
      if (filters.sortBy === 'price_asc') {
        query += ' ORDER BY f.price ASC';
      } else if (filters.sortBy === 'price_desc') {
        query += ' ORDER BY f.price DESC';
      } else {
        query += ' ORDER BY f.id DESC';
      }

      // 6. Phân trang
      const limit = parseInt(filters.limit) || 12; // Tăng limit cho grid đẹp hơn
      const offset = ((parseInt(filters.page) || 1) - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await db.query(query, params);
      return rows;
    },
  
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findByIdWithOptions: async (id) => {
    const [foods] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
    if (!foods[0]) return null;

    const [groups] = await db.query(
      `SELECT og.* FROM option_groups og
       JOIN food_option_assignments fo ON og.id = fo.group_id
       WHERE fo.food_id = ?`,
      [id]
    );

    for (let group of groups) {
      const [items] = await db.query(
        'SELECT * FROM option_items WHERE group_id = ? AND is_available = true',
        [group.id]
      );
      group.items = items;
    }

    return { ...foods[0], option_groups: groups };
  },

  create: async (data) => {
    const { name, price, image_url, shop_id, category_id } = data;
    const [res] = await db.query(
      'INSERT INTO foods (name, price, image_url, shop_id, category_id, status) VALUES (?, ?, ?, ?, ?, "available")',
      [name, price, image_url || '', shop_id, category_id || null]
    );
    return Food.findById(res.insertId);
  },

  update: async (id, data) => {
    const allowedUpdates = ['name', 'price', 'image_url', 'category_id', 'status'];
    const actualUpdates = Object.keys(data).filter(key => allowedUpdates.includes(key));
    
    if (actualUpdates.length === 0) return Food.findById(id);

    const fields = actualUpdates.map((k) => `${k} = ?`).join(', ');
    const values = actualUpdates.map(key => data[key]);

    await db.query(`UPDATE foods SET ${fields} WHERE id = ?`, [...values, id]);
    return Food.findById(id);
  },

  softDelete: async (id) => {
    await db.query('UPDATE foods SET status = "hidden" WHERE id = ?', [id]);
    return { id, status: 'hidden' };
  },

  updateStatus: async (id, status) => {
    await db.query('UPDATE foods SET status = ? WHERE id = ?', [status, id]);
    return Food.findById(id);
  }
};

module.exports = Food;