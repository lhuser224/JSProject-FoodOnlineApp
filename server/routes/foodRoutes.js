const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * GET /FoodO/foods
 * Get all foods with optional filtering by shop
 */
router.get('/', async (req, res) => {
    try {
        const { shop_id, category_id, status } = req.query;
        let query = 'SELECT f.*, c.name as category_name, s.shop_name FROM foods f LEFT JOIN categories c ON f.category_id = c.id LEFT JOIN shops s ON f.shop_id = s.id';
        const params = [];

        if (shop_id) {
            query += ' WHERE f.shop_id = ?';
            params.push(shop_id);
        }
        if (category_id) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' f.category_id = ?';
            params.push(category_id);
        }
        if (status) {
            query += params.length ? ' AND' : ' WHERE';
            query += ' f.status = ?';
            params.push(status);
        }

        const [foods] = await db.query(query, params);
        res.json(foods);
    } catch (error) {
        console.error('Error fetching foods:', error);
        res.status(500).json({ message: 'Error fetching foods' });
    }
});

/**
 * GET /FoodO/foods/:id
 * Get single food by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [foods] = await db.query(
            'SELECT f.*, c.name as category_name FROM foods f LEFT JOIN categories c ON f.category_id = c.id WHERE f.id = ?',
            [id]
        );

        if (foods.length === 0) {
            return res.status(404).json({ message: 'Food not found' });
        }

        res.json(foods[0]);
    } catch (error) {
        console.error('Error fetching food:', error);
        res.status(500).json({ message: 'Error fetching food' });
    }
});

/**
 * GET /FoodO/foods/search
 * Search foods by name or category
 */
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query required' });
        }

        const searchTerm = `%${q}%`;
        const [foods] = await db.query(
            'SELECT f.*, c.name as category_name FROM foods f LEFT JOIN categories c ON f.category_id = c.id WHERE f.name LIKE ? OR c.name LIKE ?',
            [searchTerm, searchTerm]
        );

        res.json(foods);
    } catch (error) {
        console.error('Error searching foods:', error);
        res.status(500).json({ message: 'Error searching foods' });
    }
});

/**
 * GET /FoodO/categories
 * Get all food categories
 */
router.get('/categories/all', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

module.exports = router;
