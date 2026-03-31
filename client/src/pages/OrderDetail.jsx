import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../services/orderService';
import styles from './OrderDetail.module.css';

const SERVER_URL = 'http://localhost:3000';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(id);
        const data = response.data?.data || response.data;
        setOrder(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/80?text=No+Food';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${SERVER_URL}${url}`;
  };

  const handleCancel = async () => {
    if (window.confirm("Xác nhận hủy đơn?")) {
      try {
        await cancelOrder(id);
        window.location.reload();
      } catch (err) {
        alert("Lỗi khi hủy đơn");
      }
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;
  if (!order) return <div className="text-center mt-5">Không tìm thấy dữ liệu.</div>;

  return (
    <div className={`container py-4 ${styles.detailPage}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-sm btn-outline-dark px-3" onClick={() => navigate(-1)}>
          &larr; TRỞ LẠI
        </button>
        <div className="text-end">
          <p className="small text-muted mb-0">ĐƠN HÀNG #{order.id}</p>
          <span className={`${styles.badge} ${styles[order.status?.toLowerCase()]}`}>
            {order.status?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm mb-4 ${styles.infoCard}`}>
            <div className="card-body p-4">
              <h6 className={styles.title}>ĐỊA CHỈ NHẬN HÀNG</h6>
              <div className="mt-3">
                <p className="fw-bold mb-1">{order.receiver_name}</p>
                <p className="text-muted small mb-1">{order.receiver_phone}</p>
                <p className="text-muted small mb-0">
                  {order.address_detail}, {order.ward}, {order.district}, {order.province}
                </p>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm ${styles.infoCard}`}>
            <div className="card-body p-4">
              <h6 className={styles.title}>DANH SÁCH MÓN ĂN</h6>
              <div className="mt-2">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="d-flex py-3 border-bottom align-items-center">
                      <div className={styles.imgContainer}>
                        <img src={getImageUrl(item.image_url)} alt={item.food_name} />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 fw-bold">{item.food_name}</h6>
                        {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                          <p className="small text-muted mb-1">
                            {Object.values(item.selected_options).join(', ')}
                          </p>
                        )}
                        <p className="small mb-0 text-secondary">x{item.quantity}</p>
                      </div>
                      <div className="text-end fw-bold text-danger">
                        ${Number(item.total_price).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted">Không có sản phẩm</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm ${styles.infoCard}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4">THANH TOÁN</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tiền hàng</span>
                <span>${Number(order.total_price).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Phí vận chuyển</span>
                <span className="text-success small">Free</span>
              </div>
              <hr className="my-3" />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Tổng cộng</span>
                <span className={styles.priceHighlight}>${Number(order.total_price).toFixed(2)}</span>
              </div>

              {order.status?.toLowerCase() === 'pending' && (
                <button className="btn btn-danger w-100 mt-4 py-2 fw-bold" onClick={handleCancel}>
                  HỦY ĐƠN HÀNG
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}