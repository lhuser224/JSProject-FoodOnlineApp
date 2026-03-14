import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useStore';
import Navbar from '../components/Navbar';
import styles from './History.module.css';

function CancelModal({ isOpen, onClose, onConfirm, orderId }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason) {
      alert('Vui lòng chọn lý do!');
      return;
    }
    onConfirm(orderId, reason);
    setReason('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalSm}>
      <h3 className={styles.modalTitle}>Hủy đơn hàng?</h3>
      <p>Đơn hàng sẽ bị hủy và không thể khôi phục.</p>

      <div className={styles.textLeft} style={{ marginBottom: '20px' }}>
        <label>Lý do hủy:</label>
        <select
          id="cancel-reason"
          className="form-control"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">-- Chọn lý do --</option>
          <option value="Thay đổi ý định">Thay đổi ý định</option>
          <option value="Tìm thấy giá rẻ hơn">Tìm thấy giá rẻ hơn</option>
          <option value="Thời gian giao quá lâu">Thời gian giao quá lâu</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <div className={styles.modalActions}>
        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          Không
        </button>
        <button
          className="btn btn-danger"
          onClick={handleConfirm}
        >
          Đồng ý hủy
        </button>
      </div>
    </div>
  );
}

export default function History() {
  const { orders, cancelOrder } = useOrders();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderRefreshTime, setOrderRefreshTime] = useState(0);

  // Auto-refresh every 60 seconds to update cancellation buttons
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderRefreshTime((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isCancellable = (orderDateStr) => {
    const orderTime = new Date(orderDateStr).getTime();
    const currentTime = new Date().getTime();
    return currentTime - orderTime < 60000; // 60 seconds
  };

  const handleOpenCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = (orderId, reason) => {
    cancelOrder(orderId, reason);
    setShowCancelModal(false);
    setSelectedOrderId(null);
    alert('Đã hủy đơn thành công');
  };

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className={`container ${styles.mainContentArea}`}>
          <div className={styles.historyEmptyState}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty"
              width="120"
            />
            <h3>Chưa có đơn hàng nào</h3>
            <p>Hãy đặt món ăn ngon ngay bây giờ!</p>
            <button className="btn btn-primary mt-20" onClick={() => navigate('/')}>
              Đặt món ngay
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className={`container ${styles.mainContentArea} ${styles.historyLayout}`}>
        <h2 className={styles.pageTitle}>Lịch sử đơn hàng</h2>

        <div className={styles.historyTabsModern}>
          <button className={`${styles.tabModern} ${styles.active}`}>Tất cả</button>
          <button className={styles.tabModern}>Đang xử lý</button>
          <button className={styles.tabModern}>Đã giao</button>
          <button className={styles.tabModern}>Đã hủy</button>
        </div>

        <div>
          {orders.map((order) => {
            const canCancel = isCancellable(order.date) && order.status === 'Processing';

            let statusBadge = '';
            let badgeClass = '';
            if (order.status === 'Processing') {
              statusBadge = 'Đang xử lý';
              badgeClass = styles.badgeWarning;
            }
            if (order.status === 'Cancelled') {
              statusBadge = 'Đã hủy';
              badgeClass = styles.badgeDanger;
            }
            if (order.status === 'Delivered') {
              statusBadge = 'Đã giao';
              badgeClass = styles.badgeSuccess;
            }

            return (
              <div
                key={order.id}
                className={styles.orderCardModern}
              >
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.shopNameSmall}>
                      <i className="fa-solid fa-store"></i> Food Order App
                    </span>
                    <span className={styles.orderId}>
                      ID: {order.id}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`${styles.badge} ${badgeClass}`}>
                      {statusBadge}
                    </span>
                    {canCancel && (
                      <span className={styles.countdownHint}>
                        <i className="fa-regular fa-clock"></i> Có thể hủy trong 1 phút
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={styles.orderItemRow}
                    >
                      <div className={styles.itemImgSmall}>
                        <i className="fa-solid fa-utensils"></i>
                      </div>
                      <div className={styles.itemDetail}>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.itemPrice}>
                          x{item.quantity || 1} &nbsp; ${(item.totalPrice || item.price).toFixed(2)}
                        </div>
                      </div>
                      <div className={styles.itemTotalPrice}>
                        ${(item.totalPrice || item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {order.cancelReason && (
                  <div className={styles.cancelReasonBox}>
                    <i className="fa-solid fa-circle-info"></i> Lý do hủy: {order.cancelReason}
                  </div>
                )}

                <div className={styles.orderFooter}>
                  <div className={styles.totalMoney}>
                    Tổng tiền: <span>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary btn-sm">
                      Mua lại
                    </button>
                    {canCancel ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenCancelModal(order.id)}
                      >
                        Hủy đơn
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled
                      >
                        Chi tiết
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCancelModal && (
        <div className={styles.successModal}>
          <CancelModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleConfirmCancel}
            orderId={selectedOrderId}
          />
        </div>
      )}
    </>
  );
}
