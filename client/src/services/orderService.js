import axiosClient from '../api/axiosClient';

const BASE_URL = 'FoodO/orders'; 

export const createOrder = async (orderData) => {
  try {
    // Backend: router.post('/', verifyToken, isCustomer, ...)
    // Chỉ cần gửi shop_id và items, user_id lấy từ Token
    const payload = {
      shop_id: parseInt(orderData.shop_id),
      items: orderData.items.map(item => ({
        food_id: item.food_id,
        quantity: item.quantity,
        selected_options: item.selected_options || {}
      }))
    };
    return await axiosClient.post(`${BASE_URL}`, payload);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderHistory = async () => {
  try {
    // SỬA: Khớp với router.get('/user/orders', ...) ở Backend
    const response = await axiosClient.get(`${BASE_URL}/user/orders`);
    return response;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    // Backend: router.get('/:id', ...)
    return await axiosClient.get(`${BASE_URL}/${orderId}`);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    // SỬA: Backend dùng router.patch('/:id/cancel', ...)
    return await axiosClient.patch(`${BASE_URL}/${orderId}/cancel`);
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    // Backend: router.patch('/:id/status', ...) dành cho Seller
    return await axiosClient.patch(`${BASE_URL}/${orderId}/status`, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export default {
  createOrder,
  getOrderHistory,
  getOrderById,
  cancelOrder,
  updateOrderStatus
};