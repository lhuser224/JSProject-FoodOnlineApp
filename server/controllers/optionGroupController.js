const db = require('../config/db');

/**
 * Get all option groups for a shop
 */
exports.getShopOptionGroups = async (req, res) => {
    try {
        const { shopId } = req.params;

        const [groups] = await db.query(
            'SELECT * FROM option_groups WHERE shop_id = ?',
            [shopId]
        );

        res.json(groups);
    } catch (error) {
        console.error('Error fetching option groups:', error);
        res.status(500).json({ message: 'Error fetching option groups' });
    }
};

/**
 * Create option group
 */
exports.createOptionGroup = async (req, res) => {
    try {
        const { shop_id, name, is_required, is_multiple, max_choices } = req.body;

        if (!shop_id || !name) {
            return res.status(400).json({ message: 'shop_id and name are required' });
        }

        const [result] = await db.query(
            'INSERT INTO option_groups (shop_id, name, is_required, is_multiple, max_choices) VALUES (?, ?, ?, ?, ?)',
            [shop_id, name, is_required || false, is_multiple !== false, max_choices || null]
        );

        res.status(201).json({
            id: result.insertId,
            shop_id,
            name,
            is_required: is_required || false,
            is_multiple: is_multiple !== false,
            max_choices
        });
    } catch (error) {
        console.error('Error creating option group:', error);
        res.status(500).json({ message: 'Error creating option group' });
    }
};

/**
 * Update option group
 */
exports.updateOptionGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, is_required, is_multiple, max_choices } = req.body;

        const [groups] = await db.query(
            'SELECT id FROM option_groups WHERE id = ?',
            [groupId]
        );

        if (groups.length === 0) {
            return res.status(404).json({ message: 'Option group not found' });
        }

        const updates = [];
        const values = [];

        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (is_required !== undefined) {
            updates.push('is_required = ?');
            values.push(is_required);
        }
        if (is_multiple !== undefined) {
            updates.push('is_multiple = ?');
            values.push(is_multiple);
        }
        if (max_choices !== undefined) {
            updates.push('max_choices = ?');
            values.push(max_choices);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(groupId);
        await db.query(
            `UPDATE option_groups SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Option group updated' });
    } catch (error) {
        console.error('Error updating option group:', error);
        res.status(500).json({ message: 'Error updating option group' });
    }
};

/**
 * Delete option group
 */
exports.deleteOptionGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        const [result] = await db.query(
            'DELETE FROM option_groups WHERE id = ?',
            [groupId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Option group not found' });
        }

        res.json({ message: 'Option group deleted' });
    } catch (error) {
        console.error('Error deleting option group:', error);
        res.status(500).json({ message: 'Error deleting option group' });
    }
};
