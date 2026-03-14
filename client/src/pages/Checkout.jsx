import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useOrders } from '../hooks/useStore';
import Navbar from '../components/Navbar';
import { createOrder } from '../services/orderService';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { cart, total, removeFromCart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRemoveItem = (index) => {
    removeFromCart(index);
  };

  const handleCheckout = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng trống! Vui lòng chọn món.');
      return;
    }

    try {
      // Get user ID (for now use a placeholder - in real app this comes from auth context)
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr).user_id : null;

      if (!userId) {
        alert('Vui lòng đăng nhập để tiếp tục!');
        return;
      }

      // Build order items with selected_options as JSON
      const orderItems = cart.map(item => ({
        food_id: item.id,
        quantity: item.quantity || 1,
        selected_options: {
          size: item.size || 'M',
          extras: item.extras || []
        }
      }));

      // Create order payload
      const orderPayload = {
        user_id: userId,
        shop_id: 1, // Default shop ID (should come from context or form)
        total_price: total,
        items: orderItems,
        user_details: {
          full_name: formData.name,
          phone: formData.phone,
          address_detail: formData.address
        },
        status: 'Processing'
      };

      // Create order via service
      const response = await createOrder(orderPayload);

      // Show success modal
      setOrderId(response.order_id || '#ORD-' + Math.floor(100000 + Math.random() * 900000));
      setShowSuccess(true);

      // Clear cart
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Lỗi đặt hàng: ' + (error.message || 'Vui lòng thử lại'));
    }
  };

  const handleReturnMenu = () => {
    setShowSuccess(false);
    navigate('/');
  };

  return (
    <>
      <Navbar />

      <div className={`container ${styles.checkoutLayout}`}>
        <div className={styles.checkoutForm}>
          <h2>Thông tin giao hàng</h2>
          <input
            type="text"
            className="form-control"
            placeholder="Họ tên"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Địa chỉ"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Số điện thoại"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <textarea className="form-control" placeholder="Ghi chú..."></textarea>
        </div>

        <div className={styles.orderSummary}>
          <h3>Đơn hàng của bạn</h3>

          <div className={styles.cartItemsList}>
            {cart.length === 0 ? (
              <p style={{ color: '#777', fontStyle: 'italic' }}>Giỏ hàng đang trống</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <div className={styles.cartItemInfo}>
                    <strong>{item.name}</strong>
                    {item.quantity && <div className={styles.quantity}>x{item.quantity}</div>}
                    <div className={styles.price}>
                      ${(item.totalPrice || item.price).toFixed(2)}
                    </div>
                  </div>
                  <button
                    className={styles.btnRemove}
                    onClick={() => handleRemoveItem(index)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className={styles.totalRow}>
            <span>Tổng tiền:</span>
            <span className={styles.totalPrice}>${total.toFixed(2)}</span>
          </div>

          <button className="btn btn-success w-100 mt-20" onClick={handleCheckout}>
            Đặt hàng ngay
          </button>

          {cart.length === 0 && (
            <button
              className="btn btn-secondary w-100 mt-20"
              onClick={() => navigate('/')}
            >
              Quay lại chọn món
            </button>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className={styles.successModal}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>Order Confirmed!</h2>
            <p>Your order has been placed successfully.</p>
            <p className={styles.orderIdText}>
              Order ID: <strong>{orderId}</strong>
            </p>
            <button className="btn btn-primary" onClick={handleReturnMenu}>
              Return to Menu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
