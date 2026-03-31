const Order = require('../models/Order');
const Food = require('../models/Food');
const Cart = require('../models/Cart');

const orderService = {
  async create(userId, orderData) {
    const { shop_id, items } = orderData;
    
    const firstFood = await Food.findById(items[0].food_id);
    if (firstFood && firstFood.seller_id === userId) {
      throw new Error('Sellers cannot buy from their own shop');
    }

    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const food = await Food.findById(item.food_id);
      if (!food) throw new Error(`Food ${item.food_id} not found`);
      const itemTotal = item.quantity * food.price;
      totalPrice += itemTotal;
      validatedItems.push({
        food_id: item.food_id,
        quantity: item.quantity,
        price: food.price,
        base_price: food.price,
        total_price: itemTotal,
        selected_options: item.selected_options || {}
      });
    }

    const order = await Order.create({
      user_id: userId,
      shop_id,
      total_price: totalPrice,
      items: validatedItems
    });

    await Cart.clearCart(userId);
    return order;
  },

  async getByUserId(userId, filters = {}) {
    const orders = await Order.findByUserId(userId, filters);
    const enriched = [];
    for (const order of orders) {
      const items = await Order.getItems(order.id);
      enriched.push({ ...order, items });
    }
    return enriched;
  },

  async getById(id) {
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');
    const items = await Order.getItems(id);
    return { ...order, items };
  },

  async updateStatus(id, status) {
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');
    const current = order.status.toLowerCase();
    if (current === 'completed' || current === 'cancelled') {
      throw new Error(`Cannot update ${current} order`);
    }
    return await Order.updateStatus(id, status.toLowerCase());
  },

  async cancel(id) {
    return await Order.cancel(id);
  }
};

module.exports = orderService;