const db = require('../config/db');

/**
 * Get all addresses for a user
 */
exports.getUserAddresses = async (req, res) => {
    try {
        const { userId } = req.params;

        const [addresses] = await db.query(
            'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC',
            [userId]
        );

        res.json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Error fetching addresses' });
    }
};

/**
 * Create new address
 */
exports.createAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { receiver_name, receiver_phone, address_detail, latitude, longitude, is_default } = req.body;

        if (!receiver_name || !receiver_phone || !address_detail) {
            return res.status(400).json({ message: 'receiver_name, receiver_phone, and address_detail are required' });
        }

        const [result] = await db.query(
            'INSERT INTO user_addresses (user_id, receiver_name, receiver_phone, address_detail, latitude, longitude, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, receiver_name, receiver_phone, address_detail, latitude || null, longitude || null, is_default || false]
        );

        res.status(201).json({
            id: result.insertId,
            user_id: userId,
            receiver_name,
            receiver_phone,
            address_detail,
            latitude,
            longitude,
            is_default
        });
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ message: 'Error creating address' });
    }
};

/**
 * Update address
 */
exports.updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { receiver_name, receiver_phone, address_detail, latitude, longitude } = req.body;

        const [addresses] = await db.query(
            'SELECT user_id FROM user_addresses WHERE id = ?',
            [addressId]
        );

        if (addresses.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const updates = [];
        const values = [];

        if (receiver_name) {
            updates.push('receiver_name = ?');
            values.push(receiver_name);
        }
        if (receiver_phone) {
            updates.push('receiver_phone = ?');
            values.push(receiver_phone);
        }
        if (address_detail) {
            updates.push('address_detail = ?');
            values.push(address_detail);
        }
        if (latitude !== undefined) {
            updates.push('latitude = ?');
            values.push(latitude);
        }
        if (longitude !== undefined) {
            updates.push('longitude = ?');
            values.push(longitude);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(addressId);
        await db.query(
            `UPDATE user_addresses SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Address updated' });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Error updating address' });
    }
};

/**
 * Set address as default
 */
exports.setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const [addresses] = await db.query(
            'SELECT user_id FROM user_addresses WHERE id = ?',
            [addressId]
        );

        if (addresses.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const userId = addresses[0].user_id;

        // Remove default from other addresses
        await db.query(
            'UPDATE user_addresses SET is_default = false WHERE user_id = ?',
            [userId]
        );

        // Set this address as default
        await db.query(
            'UPDATE user_addresses SET is_default = true WHERE id = ?',
            [addressId]
        );

        res.json({ message: 'Default address updated' });
    } catch (error) {
        console.error('Error setting default address:', error);
        res.status(500).json({ message: 'Error setting default address' });
    }
};

/**
 * Delete address
 */
exports.deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const [result] = await db.query(
            'DELETE FROM user_addresses WHERE id = ?',
            [addressId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.json({ message: 'Address deleted' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Error deleting address' });
    }
};
