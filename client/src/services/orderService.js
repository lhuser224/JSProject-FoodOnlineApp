import axiosClient from '../api/axiosClient';

export const createOrder = async (orderData) => {
  try {
    if (!orderData.user_id || !orderData.shop_id || !orderData.items || orderData.items.length === 0) {
      throw new Error('user_id, shop_id, and items are required');
    }

    const payload = {
      user_id: orderData.user_id,
      shop_id: orderData.shop_id,
      total_price: parseFloat(orderData.total_price), // Ensure decimal type
      items: orderData.items.map(item => ({
        food_id: item.food_id,
        quantity: item.quantity,
        selected_options: JSON.stringify(item.selected_options || {}) // Ensure JSON string
      })),
      user_details: {
        full_name: orderData.user_details.full_name,
        phone: orderData.user_details.phone,
        address_detail: orderData.user_details.address_detail
      },
      status: orderData.status || 'Processing'
    };

    const response = await axiosClient.post('/orders', payload);
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get order history for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of user's orders
 */
export const getOrderHistory = async (userId) => {
  try {
    if (!userId) {
      throw new Error('userId is required');
    }

    const response = await axiosClient.get(`/orders/history/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

/**
 * Get a single order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error('orderId is required');
    }

    const response = await axiosClient.get(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Cancel an order
 * Updates order status and stores cancellation reason
 * Also dispatches to Context API for real-time UI update
 * @param {number} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @param {Function} dispatchContext - Optional Context dispatch function for cancelling in Context
 * @returns {Promise<Object>} Updated order
 */
export const cancelOrder = async (orderId, reason, dispatchContext) => {
  try {
    if (!orderId || !reason) {
      throw new Error('orderId and reason are required');
    }

    const payload = {
      reason
    };

    const response = await axiosClient.patch(
      `/orders/${orderId}/cancel`,
      payload
    );

    // Optionally dispatch to Context if function provided
    if (dispatchContext) {
      dispatchContext({
        type: 'CANCEL_ORDER',
        payload: { orderId, reason }
      });
    }

    return response;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {number} orderId - Order ID
 * @param {string} status - New status (e.g., 'Confirmed', 'Shipped', 'Delivered')
 * @param {Function} dispatchContext - Optional Context dispatch function for updating in Context
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status, dispatchContext) => {
  try {
    if (!orderId || !status) {
      throw new Error('orderId and status are required');
    }

    const payload = { status };

    const response = await axiosClient.patch(
      `/orders/${orderId}`,
      payload
    );

    // Optionally dispatch to Context if function provided
    if (dispatchContext) {
      dispatchContext({
        type: 'UPDATE_ORDER_STATUS',
        payload: { orderId, status }
      });
    }

    return response;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Get order statistics for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} { total_orders, total_spent, recent_orders }
 */
export const getOrderStats = async (userId) => {
  try {
    const response = await axiosClient.get(`/orders/stats/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
};

/**
 * Calculate order subtotal from items
 * Helper function to calculate based on cart items with options
 * @param {Array} items - Array of items with { price, quantity, selected_options }
 * @returns {number} Subtotal
 */
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => {
    let itemPrice = item.price || 0;

    // Add option prices if they exist
    if (item.selected_options) {
      if (item.selected_options.extras) {
        item.selected_options.extras.forEach((extra) => {
          if (extra === 'Egg') itemPrice += 1;
          if (extra === 'Cheese') itemPrice += 1.5;
        });
      }
      if (item.selected_options.size === 'L') itemPrice += 2;
    }

    return sum + (itemPrice * (item.quantity || 1));
  }, 0);
};

export default {
  createOrder,
  getOrderHistory,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getOrderStats,
  calculateSubtotal
};
