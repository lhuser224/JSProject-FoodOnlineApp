import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { createOrder } from '../services/orderService';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { state, dispatch } = useContext(AppContext);
  const { cart } = state;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    note: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);
  }, []);

  const total = cart.reduce((sum, item) => {
    return sum + (item.totalPrice || item.price * item.quantity);
  }, 0);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRemoveItem = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để tiếp tục!');
      navigate('/auth');
      return;
    }

    if (!formData.name || !formData.address || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    try {
      setLoading(true);
      const orderItems = cart.map(item => ({
        food_id: item.id,
        quantity: item.quantity,
        selected_options: item.selected_options || {
          size: item.size || 'M',
          extras: item.extras || []
        }
      }));

      const orderPayload = {
        shop_id: 1,
        total_price: total + 2, // Gồm cả phí vận chuyển
        items: orderItems,
        customer_info: formData
      };

      const response = await createOrder(orderPayload);

      setOrderId(response.data?.id || '#ORD-' + Math.floor(100000 + Math.random() * 900000));
      setShowSuccess(true);
      dispatch({ type: 'CLEAR_CART' });
      
      setTimeout(() => {
        navigate('/history');
      }, 3000);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Lỗi: ' + (error.message || 'Không thể tạo đơn hàng!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className={`container ${styles.checkoutLayout}`}>
        <div className={styles.checkoutForm}>
          <h2>Thông tin giao hàng</h2>
          <div className={styles.formGroup}>
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
            <textarea 
              id="note"
              className="form-control" 
              placeholder="Ghi chú thêm (vị trí, yêu cầu đặc biệt...)"
              value={formData.note}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        <div className={styles.orderSummary}>
          <h3>Đơn hàng của bạn</h3>

          <div className={styles.cartItemsList}>
            {cart.length === 0 ? (
              <p className={styles.emptyMsg}>Giỏ hàng đang trống</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <div className={styles.cartItemInfo}>
                    <strong>{item.name}</strong>
                    <div className={styles.meta}>Size {item.size || 'M'} {item.extras?.length > 0 && `+ ${item.extras.join(', ')}`}</div>
                    <div className={styles.priceRow}>
                      <span>x{item.quantity}</span>
                      <span>${(item.totalPrice || item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button className={styles.btnRemove} onClick={() => handleRemoveItem(index)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <hr />

          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Tạm tính:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Phí vận chuyển:</span>
              <span>$2.00</span>
            </div>
          </div>

          <div className={styles.totalRow}>
            <span>Tổng cộng:</span>
            <span className={styles.totalPrice}>${(total + 2).toFixed(2)}</span>
          </div>

          <button
            className="btn btn-success w-100 mt-20"
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className={styles.successModal}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>Đặt hàng thành công!</h2>
            <p>Mã đơn hàng: <strong>{orderId}</strong></p>
            <p>Đang chuyển hướng đến lịch sử đơn hàng...</p>
            <button className="btn btn-primary mt-20" onClick={() => navigate('/')}>
              Về trang chủ ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
}