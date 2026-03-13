import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useCart() {
  const { state, dispatch } = useContext(AppContext);

  return {
    cart: state.cart,
    addToCart: (product) => {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    },
    removeFromCart: (index) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: index });
    },
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
    },
    total: state.cart.reduce((sum, item) => {
      // If item has totalPrice (from modal with options), use it; otherwise use price
      return sum + (item.totalPrice || item.price);
    }, 0)
  };
}

export function useOrders() {
  const { state, dispatch } = useContext(AppContext);

  return {
    orders: state.orders,
    addOrder: (order) => {
      dispatch({ type: 'ADD_ORDER', payload: order });
    },
    updateOrderStatus: (orderId, status) => {
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    },
    cancelOrder: (orderId, reason) => {
      dispatch({ type: 'CANCEL_ORDER', payload: { orderId, reason } });
    }
  };
}

export function useProducts() {
  const { state } = useContext(AppContext);

  return {
    products: state.products
  };
}

export function useAppStore() {
  const { state, dispatch } = useContext(AppContext);

  return { state, dispatch };
}
