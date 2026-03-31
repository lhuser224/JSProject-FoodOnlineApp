import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderHistory, cancelOrder } from '../services/orderService';
import styles from './History.module.css';

export default function History() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrderHistory();
      const result = response?.data?.data || response?.data || [];
      setOrders(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/auth');
    else loadOrders();
  }, [navigate, loadOrders]);

  const filteredOrders = orders.filter(o => 
    activeTab === 'ALL' || o.status?.toUpperCase() === activeTab
  );

  return (
    <div className={styles.mainContentArea}>
      <h2 className={styles.pageTitle}>Đơn hàng của tôi</h2>

      {/* Tabs */}
      <div className={styles.historyTabsModern}>
        {['ALL', 'PENDING', 'SHIPPING', 'COMPLETED', 'CANCELLED'].map(tab => (
          <button 
            key={tab}
            className={`${styles.tabModern} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'ALL' ? 'Tất cả' : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">Đang tải...</div>
      ) : filteredOrders.length === 0 ? (
        <div className={styles.historyEmptyState}>Bạn chưa có đơn hàng nào.</div>
      ) : (
        <div className={styles.orderListContainer}>
          {filteredOrders.map((order) => (
            <div key={order.id} className={styles.orderCardModern}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.shopNameSmall}>FoodO App</span>
                  <span className={styles.orderId}>Mã đơn: #{order.id}</span>
                </div>
                <span className={`${styles.badge} ${styles[order.status?.toLowerCase()] || ''}`}>
                  {order.status?.toUpperCase()}
                </span>
              </div>

              <div className={styles.orderContent}>
                {/* Render danh sách món ăn */}
                {order.items?.map((item, idx) => (
                  <div key={idx} className={styles.orderItemRow}>
                    <div className={styles.itemImgSmall}>📦</div>
                    <div className={styles.itemDetail}>
                      <div className={styles.itemName}>{item.food_name || 'Tên món ăn'}</div>
                      <div className={styles.itemPrice}>Số lượng: x{item.quantity}</div>
                    </div>
                    <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <div className={styles.totalMoney}>
                  Tổng số tiền: <span>${Number(order.total_price).toFixed(2)}</span>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary btn-sm px-4"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}