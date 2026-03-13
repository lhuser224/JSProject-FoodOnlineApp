import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SellerDashboard() {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image_url: ''
  });

  // Load products from backend
  useEffect(() => {
    loadProducts();
  }, [shopId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/FoodO/seller/${shopId}/foods`);
      if (!response.ok) throw new Error('Lỗi Server');

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Lỗi fetch:', error);
      showAlert('Không thể kết nối đến Database!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (msg, type) => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => {
      setAlertMsg('');
      setAlertType('');
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitFood = async () => {
    if (!formData.name || !formData.price) {
      showAlert('Lỗi: Vui lòng nhập đầy đủ tên và giá!', 'error');
      return;
    }

    try {
      const res = await fetch(`/FoodO/seller/${shopId}/add-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: formData.price,
          image_url: formData.image_url,
          category_id: 1
        })
      });

      const result = await res.json();

      if (res.ok) {
        showAlert('Thành công: ' + result.message, 'success');
        setShowForm(false);
        setFormData({ name: '', price: '', image_url: '' });
        loadProducts(); // Reload products
      } else {
        showAlert('Lỗi: ' + result.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Lỗi: Không thể kết nối Server!', 'error');
    }
  };

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .main-content-area { display: flex; gap: 20px; padding: 20px; }
        .sidebar-wireframe { width: 250px; }
      `}</style>

      <div className="container main-content-area mt-20">
        <aside className="sidebar-wireframe">
          <h3 className="filter-title">Quản lý Cửa hàng #{shopId}</h3>
          <button
            className="btn btn-primary w-100 mb-10"
            onClick={() => setShowForm(!showForm)}
            style={{ marginBottom: '10px' }}
          >
            <i className="fa-solid fa-plus"></i> Thêm món mới
          </button>
          <p className="checkbox-row">
            Sản phẩm: <strong id="product-count">{products.length}</strong>
          </p>
        </aside>

        <main className="product-section">
          {/* Status Alert */}
          {alertMsg && (
            <div
              id="status-alert"
              style={{
                backgroundColor: alertType === 'success' ? '#2ecc71' : '#e74c3c',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontWeight: 'bold',
                textAlign: 'center',
                animation: 'slideIn 0.4s ease-out'
              }}
            >
              {alertMsg}
            </div>
          )}

          {/* Form Display */}
          {showForm && (
            <div
              id="seller-form-display"
              className="order-card-modern"
              style={{
                marginBottom: '30px',
                border: '2px solid #ee4d2d',
                padding: '20px',
                borderRadius: '8px'
              }}
            >
              <div id="form-inner-content">
                <h2 className="auth-title">Thêm món ăn</h2>
                <div className="input-group">
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Tên món"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="number"
                    id="price"
                    className="form-control"
                    placeholder="Giá ($)"
                    value={formData.price}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    id="image_url"
                    className="form-control"
                    placeholder="Link hình ảnh"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}
                  />
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={handleSubmitFood}
                  id="btn-submit-test"
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#ee4d2d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                >
                  Lưu món ăn
                </button>
              </div>
              <div className="text-right mt-10" style={{ textAlign: 'right', marginTop: '10px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          <div className="section-head">
            <h3>Thực đơn từ Database</h3>
          </div>

          {loading ? (
            <div className="grid-v2">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="grid-v2">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="card-v2">
                    <div className="card-thumb">
                      <div className="img-placeholder">
                        <i className="fa-solid fa-utensils"></i>
                      </div>
                      <div className="badge-time">
                        {product.status === 'available' ? 'Đang bán' : 'Tạm ẩn'}
                      </div>
                    </div>
                    <div className="card-details">
                      <h4 className="food-name">{product.name}</h4>
                      <div className="price-tag">${product.price}</div>
                      <div className="card-bottom">
                        <label className="switch">
                          <input
                            type="checkbox"
                            defaultChecked={product.status === 'available'}
                          />
                          <span className="slider"></span>
                        </label>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '6px 12px',
                            background: '#95a5a6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có món ăn nào.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
