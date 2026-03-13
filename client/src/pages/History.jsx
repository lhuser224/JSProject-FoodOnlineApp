import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useStore';
import Navbar from '../components/Navbar';

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
    <div
      id="cancel-modal"
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
        className="modal-content modal-sm"
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '30px',
          minWidth: '400px'
        }}
      >
        <h3 className="modal-title">Hủy đơn hàng?</h3>
        <p>Đơn hàng sẽ bị hủy và không thể khôi phục.</p>

        <div className="form-group text-left" style={{ textAlign: 'left', marginBottom: '20px' }}>
          <label>Lý do hủy:</label>
          <select
            id="cancel-reason"
            className="form-control"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '8px'
            }}
          >
            <option value="">-- Chọn lý do --</option>
            <option value="Thay đổi ý định">Thay đổi ý định</option>
            <option value="Tìm thấy giá rẻ hơn">Tìm thấy giá rẻ hơn</option>
            <option value="Thời gian giao quá lâu">Thời gian giao quá lâu</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div
          className="modal-actions"
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
        >
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Không
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirm}
            style={{
              padding: '8px 16px',
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Đồng ý hủy
          </button>
        </div>
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
        <div className="container main-content-area">
          <div
            className="history-empty-state"
            style={{
              textAlign: 'center',
              padding: '40px 20px'
            }}
          >
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

      <div className="container main-content-area history-layout">
        <h2 className="page-title">Lịch sử đơn hàng</h2>

        <div className="history-tabs-modern">
          <button className="tab-modern active">Tất cả</button>
          <button className="tab-modern">Đang xử lý</button>
          <button className="tab-modern">Đã giao</button>
          <button className="tab-modern">Đã hủy</button>
        </div>

        <div className="order-list-container">
          {orders.map((order) => {
            const canCancel = isCancellable(order.date) && order.status === 'Processing';

            let statusBadge = '';
            let badgeColor = '';
            if (order.status === 'Processing') {
              statusBadge = 'Đang xử lý';
              badgeColor = '#f39c12';
            }
            if (order.status === 'Cancelled') {
              statusBadge = 'Đã hủy';
              badgeColor = '#e74c3c';
            }
            if (order.status === 'Delivered') {
              statusBadge = 'Đã giao';
              badgeColor = '#2ecc71';
            }

            return (
              <div
                key={order.id}
                className="order-card-modern"
                style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px',
                  backgroundColor: '#fafafa'
                }}
              >
                <div className="order-header" style={{ marginBottom: '15px' }}>
                  <div className="order-info-left">
                    <span className="shop-name-small" style={{ display: 'block', marginBottom: '5px' }}>
                      <i className="fa-solid fa-store"></i> Food Order App
                    </span>
                    <span className="order-id" style={{ display: 'block', color: '#666' }}>
                      ID: {order.id}
                    </span>
                  </div>
                  <div
                    className="order-status-right"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span
                      className="badge"
                      style={{
                        background: badgeColor,
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {statusBadge}
                    </span>
                    {canCancel && (
                      <span
                        className="countdown-hint"
                        style={{
                          fontSize: '0.85rem',
                          color: '#f39c12'
                        }}
                      >
                        <i className="fa-regular fa-clock"></i> Có thể hủy trong 1 phút
                      </span>
                    )}
                  </div>
                </div>

                <div className="order-items-wrap" style={{ marginBottom: '15px' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="order-item-row"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 0',
                        borderBottom: '1px dashed #eee'
                      }}
                    >
                      <div
                        className="item-img-small"
                        style={{
                          fontSize: '20px',
                          minWidth: '30px',
                          textAlign: 'center'
                        }}
                      >
                        <i className="fa-solid fa-utensils"></i>
                      </div>
                      <div className="item-detail" style={{ flex: 1 }}>
                        <div className="item-name">{item.name}</div>
                        <div className="item-price" style={{ fontSize: '0.9rem', color: '#666' }}>
                          x{item.quantity || 1} &nbsp; ${(item.totalPrice || item.price).toFixed(2)}
                        </div>
                      </div>
                      <div className="item-total-price" style={{ fontWeight: 'bold' }}>
                        ${(item.totalPrice || item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {order.cancelReason && (
                  <div
                    className="cancel-reason-box"
                    style={{
                      background: '#ffe6e6',
                      padding: '10px',
                      borderRadius: '4px',
                      color: '#c33',
                      marginBottom: '15px'
                    }}
                  >
                    <i className="fa-solid fa-circle-info"></i> Lý do hủy: {order.cancelReason}
                  </div>
                )}

                <div
                  className="order-footer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #eee',
                    paddingTop: '15px'
                  }}
                >
                  <div className="total-money">
                    Tổng tiền: <span style={{ fontWeight: 'bold', color: '#ee4d2d' }}>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="footer-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Mua lại
                    </button>
                    {canCancel ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleOpenCancelModal(order.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#e74c3c',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Hủy đơn
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        disabled
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'not-allowed',
                          opacity: 0.6
                        }}
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

      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        orderId={selectedOrderId}
      />
    </>
  );
}
