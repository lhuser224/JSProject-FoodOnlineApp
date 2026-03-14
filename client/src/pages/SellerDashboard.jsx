import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getFoods, addFood, toggleFoodStatus } from '../services/foodService';
import styles from './SellerDashboard.module.css';

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
      const data = await getFoods(shopId);
      setProducts(data);
    } catch (error) {
      console.error('Lỗi fetch:', error);
      showAlert('Không thể kết nối đến Database!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFoodStatus = async (foodId) => {
    try {
      await toggleFoodStatus(shopId, foodId);
      loadProducts(); // Reload to reflect status change
      showAlert('Trạng thái đã được cập nhật!', 'success');
    } catch (error) {
      console.error('Error toggling status:', error);
      showAlert('Lỗi: Không thể cập nhật trạng thái!', 'error');
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
      const result = await addFood(shopId, {
        name: formData.name,
        price: formData.price,
        image_url: formData.image_url,
        category_id: 1
      });

      showAlert('Thành công: Món ăn đã được thêm!', 'success');
      setShowForm(false);
      setFormData({ name: '', price: '', image_url: '' });
      loadProducts(); // Reload products
    } catch (err) {
      console.error(err);
      showAlert('Lỗi: ' + (err.message || 'Không thể kết nối Server!'), 'error');
    }
  };

  return (
    <>
      <Navbar />

      <div className={`container ${styles.mainContentArea} mt-20`}>
        <aside className={styles.sidebarWireframe}>
          <h3 className={styles.filterTitle}>Quản lý Cửa hàng #{shopId}</h3>
          <button
            className="btn btn-primary w-100 mb-10"
            onClick={() => setShowForm(!showForm)}
          >
            <i className="fa-solid fa-plus"></i> Thêm món mới
          </button>
          <p className={styles.checkboxRow}>
            Sản phẩm: <strong className={styles.productCount}>{products.length}</strong>
          </p>
        </aside>

        <main className={styles.productSection}>
          {/* Status Alert */}
          {alertMsg && (
            <div
              className={`${styles.statusAlert} ${alertType === 'error' ? styles.error : ''}`}
            >
              {alertMsg}
            </div>
          )}

          {/* Form Display */}
          {showForm && (
            <div className={styles.sellerFormDisplay}>
              <div className={styles.formInnerContent}>
                <h2>Thêm món ăn</h2>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Tên món"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    id="price"
                    className="form-control"
                    placeholder="Giá ($)"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="image_url"
                    className="form-control"
                    placeholder="Link hình ảnh"
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  className={styles.btnSubmit}
                  onClick={handleSubmitFood}
                >
                  Lưu món ăn
                </button>
              </div>
              <div className={styles.textRight}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          <div className={styles.sectionHead}>
            <h3>Thực đơn từ Database</h3>
          </div>

          {loading ? (
            <div className={styles.gridV2}>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className={styles.gridV2}>
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className={styles.cardV2}>
                    <div className={styles.cardThumb}>
                      <div className={styles.imgPlaceholder}>
                        <i className="fa-solid fa-utensils"></i>
                      </div>
                      <div className={styles.badgeTime}>
                        {product.status === 'available' ? 'Đang bán' : 'Tạm ẩn'}
                      </div>
                    </div>
                    <div className={styles.cardDetails}>
                      <h4 className={styles.foodName}>{product.name}</h4>
                      <div className={styles.priceTag}>${product.price}</div>
                      <div className={styles.cardBottom}>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            defaultChecked={product.status === 'available'}
                            onChange={() => handleToggleFoodStatus(product.id)}
                          />
                          <span className={styles.slider}></span>
                        </label>
                        <button
                          className={styles.btnEdit}
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
