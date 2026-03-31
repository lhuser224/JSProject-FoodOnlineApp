import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Theo mẫu từ Profile.jsx
import { getOrderHistory, cancelOrder } from '../services/orderService';
import styles from './History.module.css';

function CancelModal({ isOpen, onClose, onConfirm, orderId }) {
  const [reason, setReason] = useState('');
  const handleConfirm = () => {
    if (!reason) { alert('Vui lòng chọn lý do!'); return; }
    onConfirm(orderId, reason);
    setReason('');
  };
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalSm}>
        <h3 className={styles.modalTitle}>Hủy đơn hàng?</h3>
        <div className={styles.textLeft} style={{ marginBottom: '20px' }}>
          <label>Lý do hủy:</label>
          <select className="form-control" value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">-- Chọn lý do --</option>
            <option value="Thay đổi ý định">Thay đổi ý định</option>
            <option value="Tìm thấy giá rẻ hơn">Tìm thấy giá rẻ hơn</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div className={styles.modalActions}>
          <button className="btn btn-secondary" onClick={onClose}>Không</button>
          <button className="btn btn-danger" onClick={handleConfirm}>Đồng ý hủy</button>
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy user từ context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancellableUntil, setCancellableUntil] = useState({});

  const loadOrders = useCallback(async () => {
    if (!user?.id) return; // Đảm bảo có userId trước khi gọi
    try {
      setLoading(true);
      const response = await getOrderHistory(user.id);
      const orderList = response.data || [];
      setOrders(orderList);

      const newCancellableUntil = {};
      orderList.forEach(order => {
        if (order.status === 'pending' || order.status === 'processing') {
          newCancellableUntil[order.id] = 60;
        }
      });
      setCancellableUntil(newCancellableUntil);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    } else {
      loadOrders();
    }
  }, [navigate, loadOrders]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCancellableUntil(prev => {
        const updated = { ...prev };
        let hasChanged = false;
        Object.keys(updated).forEach(id => {
          if (updated[id] > 0) { updated[id] -= 1; hasChanged = true; }
          else { delete updated[id]; hasChanged = true; }
        });
        return hasChanged ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleConfirmCancel = async (orderId, reason) => {
    try {
      await cancelOrder(orderId, reason); // Truyền đủ orderId và reason
      alert('Đã hủy đơn hàng thành công');
      setShowCancelModal(false);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      setCancellableUntil(prev => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
    } catch (error) {
      alert('Không thể hủy đơn hàng lúc này!');
    }
  };

  return (
    <div className={`container ${styles.mainContentArea}`}>
      <h2 className={styles.pageTitle}>Lịch sử đơn hàng</h2>
      {loading ? (
        <div className="text-center">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="text-center">Chưa có đơn hàng nào</div>
      ) : (
        <div className={styles.orderListContainer}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCardModern}>
              <div className={styles.orderHeader}>
                <span>ID: {order.id}</span>
                <span className={styles.badge}>{order.status}</span>
              </div>
              <div className={styles.orderFooter}>
                <div>Tổng: ${order.total_price?.toFixed(2)}</div>
                {cancellableUntil[order.id] > 0 && (
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => { setSelectedOrderId(order.id); setShowCancelModal(true); }}
                  >
                    Hủy ({cancellableUntil[order.id]}s)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <CancelModal 
        isOpen={showCancelModal} 
        onClose={() => setShowCancelModal(false)} 
        onConfirm={handleConfirmCancel} 
        orderId={selectedOrderId} 
      />
    </div>
  );
}