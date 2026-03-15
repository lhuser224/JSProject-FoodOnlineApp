const db = require('../config/db');

/**
 * Get all option items for a group
 */
exports.getGroupOptionItems = async (req, res) => {
    try {
        const { groupId } = req.params;

        const [items] = await db.query(
            'SELECT * FROM option_items WHERE group_id = ?',
            [groupId]
        );

        res.json(items);
    } catch (error) {
        console.error('Error fetching option items:', error);
        res.status(500).json({ message: 'Error fetching option items' });
    }
};

/**
 * Create option item
 */
exports.createOptionItem = async (req, res) => {
    try {
        const { group_id, name, price, is_available } = req.body;

        if (!group_id || !name) {
            return res.status(400).json({ message: 'group_id and name are required' });
        }

        const [result] = await db.query(
            'INSERT INTO option_items (group_id, name, price, is_available) VALUES (?, ?, ?, ?)',
            [group_id, name, price || 0, is_available !== false]
        );

        res.status(201).json({
            id: result.insertId,
            group_id,
            name,
            price: price || 0,
            is_available: is_available !== false
        });
    } catch (error) {
        console.error('Error creating option item:', error);
        res.status(500).json({ message: 'Error creating option item' });
    }
};

/**
 * Update option item
 */
exports.updateOptionItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { name, price, is_available } = req.body;

        const [items] = await db.query(
            'SELECT id FROM option_items WHERE id = ?',
            [itemId]
        );

        if (items.length === 0) {
            return res.status(404).json({ message: 'Option item not found' });
        }

        const updates = [];
        const values = [];

        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (price !== undefined) {
            updates.push('price = ?');
            values.push(price);
        }
        if (is_available !== undefined) {
            updates.push('is_available = ?');
            values.push(is_available);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(itemId);
        await db.query(
            `UPDATE option_items SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Option item updated' });
    } catch (error) {
        console.error('Error updating option item:', error);
        res.status(500).json({ message: 'Error updating option item' });
    }
};

/**
 * Delete option item
 */
exports.deleteOptionItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        const [result] = await db.query(
            'DELETE FROM option_items WHERE id = ?',
            [itemId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Option item not found' });
        }

        res.json({ message: 'Option item deleted' });
    } catch (error) {
        console.error('Error deleting option item:', error);
        res.status(500).json({ message: 'Error deleting option item' });
    }
};
