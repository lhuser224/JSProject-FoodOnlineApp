import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useOrders } from '../hooks/useStore';
import Navbar from '../components/Navbar';

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

  const handleCheckout = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng trống! Vui lòng chọn món.');
      return;
    }

    // Create order
    const newOrderId = '#ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: newOrderId,
      date: new Date().toLocaleString(),
      total: total,
      status: 'Processing',
      items: [...cart]
    };

    // Add order to history
    addOrder(newOrder);

    // Clear cart
    clearCart();

    // Show success modal
    setOrderId(newOrderId);
    setShowSuccess(true);
  };

  const handleReturnMenu = () => {
    setShowSuccess(false);
    navigate('/');
  };

  return (
    <>
      <Navbar />

      <div className="container checkout-layout">
        <div className="checkout-form">
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

        <div className="order-summary">
          <h3>Đơn hàng của bạn</h3>

          <div className="cart-items-list" style={{ marginBottom: '20px' }}>
            {cart.length === 0 ? (
              <p style={{ color: '#777', fontStyle: 'italic' }}>Giỏ hàng đang trống</p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px dashed #eee',
                    padding: '10px 0'
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>
                    {item.quantity && <div style={{ fontSize: '0.85rem', color: '#555' }}>x{item.quantity}</div>}
                    <div style={{ fontSize: '0.9rem', color: '#555' }}>
                      ${(item.totalPrice || item.price).toFixed(2)}
                    </div>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveItem(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'red',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              borderTop: '2px solid #eee',
              paddingTop: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            <span>Tổng tiền:</span>
            <span style={{ color: '#ee4d2d' }}>${total.toFixed(2)}</span>
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
        <div
          id="success-modal"
          className="modal-overlay"
          style={{
            display: 'flex',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            className="modal-content"
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              minWidth: '400px'
            }}
          >
            <div
              className="success-icon"
              style={{ fontSize: '60px', color: '#2ecc71', marginBottom: '20px' }}
            >
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>Order Confirmed!</h2>
            <p>Your order has been placed successfully.</p>
            <p className="order-id-text">
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
