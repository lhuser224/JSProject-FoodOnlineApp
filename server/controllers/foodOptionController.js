const db = require('../config/db');

/**
 * Get option groups for a food
 */
exports.getFoodOptionGroups = async (req, res) => {
    try {
        const { foodId } = req.params;

        const [assignments] = await db.query(
            `SELECT og.* FROM option_groups og 
             INNER JOIN food_option_assignments foa ON og.id = foa.group_id 
             WHERE foa.food_id = ?`,
            [foodId]
        );

        res.json(assignments);
    } catch (error) {
        console.error('Error fetching food option groups:', error);
        res.status(500).json({ message: 'Error fetching food option groups' });
    }
};

/**
 * Assign option group to food
 */
exports.assignOptionToFood = async (req, res) => {
    try {
        const { food_id, group_id } = req.body;

        if (!food_id || !group_id) {
            return res.status(400).json({ message: 'food_id and group_id are required' });
        }

        // Check if already assigned
        const [existing] = await db.query(
            'SELECT * FROM food_option_assignments WHERE food_id = ? AND group_id = ?',
            [food_id, group_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'Option group already assigned to food' });
        }

        await db.query(
            'INSERT INTO food_option_assignments (food_id, group_id) VALUES (?, ?)',
            [food_id, group_id]
        );

        res.status(201).json({
            food_id,
            group_id,
            message: 'Option group assigned to food'
        });
    } catch (error) {
        console.error('Error assigning option to food:', error);
        res.status(500).json({ message: 'Error assigning option to food' });
    }
};

/**
 * Remove option group from food
 */
exports.removeOptionFromFood = async (req, res) => {
    try {
        const { foodId, groupId } = req.params;

        const [result] = await db.query(
            'DELETE FROM food_option_assignments WHERE food_id = ? AND group_id = ?',
            [foodId, groupId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.json({ message: 'Option group removed from food' });
    } catch (error) {
        console.error('Error removing option from food:', error);
        res.status(500).json({ message: 'Error removing option from food' });
    }
};
