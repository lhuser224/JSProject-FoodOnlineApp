import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { createOrder } from '../services/orderService';
import addressService from '../services/addressService';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { state, dispatch } = useContext(AppContext);
  const { cart } = state;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    note: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const authStatus = !!token && !!user;
    setIsLoggedIn(authStatus);

    if (authStatus) {
      const fetchAddresses = async () => {
        try {
          const res = await addressService.getAddresses();
          const list = res.data || [];
          setSavedAddresses(list);
          
          const defaultAddr = list.find(a => a.is_default);
          if (defaultAddr) {
            setFormData(prev => ({
              ...prev,
              name: defaultAddr.receiver_name || '',
              address: defaultAddr.address_detail,
              phone: defaultAddr.receiver_phone
            }));
          }
        } catch (err) {
          console.error("Lấy danh sách địa chỉ thất bại:", err);
        }
      };
      fetchAddresses();
    }
  }, []);

  const total = cart.reduce((sum, item) => {
    const unitPrice = Number(item.food?.price || item.price || 0);
    return sum + (unitPrice * (Number(item.quantity) || 1));
  }, 0);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectAddress = (addr) => {
    setFormData({
      name: addr.receiver_name || '',
      address: addr.address_detail,
      phone: addr.receiver_phone,
      note: formData.note 
    });
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập!');
      navigate('/auth');
      return;
    }

    if (!formData.name || !formData.address || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    try {
      setLoading(true);
      const orderItems = cart.map(item => ({
        food_id: item.food_id || item.food?.id, 
        quantity: item.quantity,
        selected_options: item.selected_options || {}
      }));

      const orderPayload = {
        shop_id: cart[0]?.food?.shop_id || 1, 
        total_price: total, 
        items: orderItems,
        customer_info: formData
      };

      const response = await createOrder(orderPayload);
      setOrderId(response.data?.id || 'ORD-' + Date.now());
      setShowSuccess(true);
      dispatch({ type: 'CLEAR_CART' });
      setTimeout(() => navigate('/history'), 3000);
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.checkoutLayout}`}>
      <div className={styles.checkoutForm}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="m-0 fw-bold">Thông tin nhận hàng</h2>
          <Link 
            to="/profile" 
            state={{ activeTab: 'address' }} 
            className="btn btn-sm btn-outline-primary fw-bold"
          >
            <i className="fa-solid fa-map-location-dot me-1"></i> Quản lý sổ địa chỉ
          </Link>
        </div>

        {savedAddresses.length > 0 && (
          <div className="mb-4">
            <label className="fw-bold small mb-2 text-muted text-uppercase text-danger">Địa chỉ đã lưu</label>
            <div className="d-flex flex-column gap-3">
              {savedAddresses.map(addr => (
                <div 
                  key={addr.id || addr._id} 
                  onClick={() => handleSelectAddress(addr)}
                  className={`p-3 border rounded shadow-sm ${formData.address === addr.address_detail ? 'border-danger bg-light shadow' : 'bg-white'}`}
                  style={{ cursor: 'pointer', transition: '0.2s' }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold fs-6 text-dark">{addr.receiver_name}</span>
                    {addr.is_default && <span className="badge bg-danger rounded-pill px-2 py-1">Mặc định</span>}
                  </div>
                  
                  <div className="small text-secondary mb-2 fw-bold">
                    <i className="fa-solid fa-phone me-2 text-muted"></i>{addr.receiver_phone}
                  </div>

                  <div className="pt-2 border-top">
                    <div className="small text-dark lh-base">
                      <i className="fa-solid fa-location-dot me-2 text-danger"></i>
                      <span className="fw-bold">Địa chỉ:</span> {addr.address_detail}
                    </div>
                    <div className="ms-4 mt-1 small text-muted d-flex flex-wrap gap-2 italic">
                      <span>Phường/Xã: {addr.ward || '---'}</span>
                      <span className="text-secondary opacity-50">|</span>
                      <span>Quận/Huyện: {addr.district || '---'}</span>
                      <span className="text-secondary opacity-50">|</span>
                      <span>Tỉnh/Thành phố: {addr.province || '---'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">HỌ VÀ TÊN NGƯỜI NHẬN</label>
            <input type="text" className="form-control form-control-lg fs-6" id="name" value={formData.name} onChange={handleInputChange} placeholder="VD: Nguyễn Văn A" />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">ĐỊA CHỈ GIAO HÀNG CHI TIẾT</label>
            <textarea 
              className="form-control form-control-lg fs-6" 
              id="address" 
              rows="3" 
              value={formData.address} 
              onChange={handleInputChange} 
              placeholder="VD: Số 123, Xã Thạch Đồng, Huyện Thanh Thuỷ, Tỉnh Phú Thọ"
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">SỐ ĐIỆN THOẠI</label>
            <input type="text" className="form-control form-control-lg fs-6" id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Số điện thoại liên hệ..." />
          </div>
          <div className="mb-0">
            <label className="form-label small fw-bold text-muted">GHI CHÚ (TÙY CHỌN)</label>
            <textarea id="note" className="form-control" rows="2" value={formData.note} onChange={handleInputChange} placeholder="VD: Cổng màu xanh, gọi trước khi đến..." />
          </div>
        </div>
      </div>

      <div className={styles.orderSummary}>
        <h3 className="mb-4 fw-bold">Chi tiết đơn hàng</h3>
        <div className={styles.cartItemsList}>
          {cart.map((item, index) => (
            <div key={index} className="py-3 border-bottom">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="fw-bold text-dark">{item.food?.name || item.name}</div>
                  
                  {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {Object.entries(item.selected_options).map(([key, value]) => (
                        <span key={key} className="badge bg-light text-dark border fw-normal py-1">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="small text-muted mt-2">Số lượng: <span className="text-dark fw-bold">{item.quantity}</span></div>
                </div>
                <div className="fw-bold text-danger ms-3">
                  ${(Number(item.food?.price || item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between mt-4 fs-4 fw-bold text-dark border-top pt-3">
          <span>Tổng cộng:</span>
          <span className="text-danger">${total.toFixed(2)}</span>
        </div>

        <button 
          className="btn btn-danger w-100 mt-4 py-3 fw-bold shadow btn-lg" 
          onClick={handleCheckout} 
          disabled={loading || cart.length === 0}
        >
          {loading ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
        </button>
      </div>

      {showSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successCard}>
            <div className="text-success mb-3 text-center">
               <i className="fa-solid fa-circle-check" style={{fontSize: '5rem'}}></i>
            </div>
            <h2 className="fw-bold text-center">Đặt hàng thành công!</h2>
            <p className="text-muted text-center">Mã đơn hàng: <strong>{orderId}</strong></p>
            <button className="btn btn-danger w-100 py-2 fw-bold" onClick={() => navigate('/')}>TIẾP TỤC MUA SẮM</button>
          </div>
        </div>
      )}
    </div>
  );
}