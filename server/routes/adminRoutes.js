const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');

/**
 * Middleware to verify admin role
 */
const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

/**
 * GET /FoodO/admin/categories
 * Get all categories
 */
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

/**
 * POST /FoodO/admin/categories
 * Create new category
 */
router.post('/categories', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const [result] = await db.query(
            'INSERT INTO categories (name) VALUES (?)',
            [name]
        );

        res.status(201).json({
            id: result.insertId,
            name
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Error creating category' });
    }
});

/**
 * GET /FoodO/admin/users
 * Get all users
 */
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, full_name, phone, role, created_at FROM users'
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

/**
 * PATCH /FoodO/admin/users/:userId/role
 * Update user role
 */
router.patch('/users/:userId/role', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const validRoles = ['customer', 'shop_owner', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await db.query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, userId]
        );

        res.json({ message: 'User role updated', role });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role' });
    }
});

/**
 * GET /FoodO/admin/shops
 * Get all shops
 */
router.get('/shops', async (req, res) => {
    try {
        const [shops] = await db.query(
            'SELECT s.*, u.full_name as owner_name FROM shops s LEFT JOIN users u ON s.user_id = u.id'
        );
        res.json(shops);
    } catch (error) {
        console.error('Error fetching shops:', error);
        res.status(500).json({ message: 'Error fetching shops' });
    }
});

/**
 * PATCH /FoodO/admin/shops/:shopId/status
 * Activate/deactivate shop
 */
router.patch('/shops/:shopId/status', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { shopId } = req.params;
        const { is_active } = req.body;

        await db.query(
            'UPDATE shops SET is_active = ? WHERE id = ?',
            [is_active, shopId]
        );

        res.json({ message: 'Shop status updated', is_active });
    } catch (error) {
        console.error('Error updating shop status:', error);
        res.status(500).json({ message: 'Error updating shop status' });
    }
});

module.exports = router;
