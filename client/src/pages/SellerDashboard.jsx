import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import foodService from '../services/foodService';
import { getMyShopInfo, toggleShopOpen  } from '../services/shopService';
import FoodModal from './FoodModal';

const SERVER_URL = 'http://localhost:3000'; 

export default function ShopDashboard() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);
  
  const initialForm = { 
    name: '', price: '', image_url: '', imageFile: null,
    category_id: 1, description: '', options: []
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const res = await getMyShopInfo();
        if (res.success) {
          setShop(res.data);
          loadFoods(res.data.id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchShopInfo();
  }, []);

  const loadFoods = async (sId) => {
    try {
      const res = await foodService.getFoodsByShop(sId);
      if (res.success) setFoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleOpen = async () => {
    try {
      const res = await toggleShopOpen(shop.id);
      if (res.success) {
        setShop({ ...shop, is_open: !shop.is_open });
      }
    } catch (err) {
      alert("Không thể cập nhật trạng thái cửa hàng: " + err.message);
    }
  };

  const handleOpenModal = (food = null) => {
    if (food) {
      setCurrentFood(food);
      setFormData({ ...food, options: food.options || [], imageFile: null });
    } else {
      setCurrentFood(null);
      setFormData({ ...initialForm, shop_id: shop?.id });
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (currentFood) {
        await foodService.updateFood(currentFood.id, formData);
      } else {
        await foodService.addFood(shop.id, formData);
      }
      setShowModal(false);
      loadFoods(shop.id);
    } catch (err) { 
        alert("Lỗi khi lưu món ăn");
    } finally { 
        setLoading(false);
    }
  };

  const handleDelete = async (foodId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await foodService.deleteFood(foodId);
        loadFoods(shop.id);
      } catch (err) {
        alert("Lỗi khi xóa món");
      }
    }
  };

  return (
    <div className="container py-5 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Quản lý thực đơn</h4>
          <p className="text-muted small">Cửa hàng: <span className="text-danger fw-bold">{shop?.shop_name || 'Loading...'}</span></p>
        </div>
        <div className="form-check form-switch ms-2">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="toggleOpen"
            checked={shop?.is_open || false} 
            onChange={handleToggleOpen} 
          />
          <label className={`form-check-label small ${shop?.is_open ? 'text-success' : 'text-muted'}`} htmlFor="toggleOpen">
            {shop?.is_open ? 'Opening' : 'Closing'}
          </label>
        </div>
        <button className="btn btn-danger shadow-sm px-4" onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus me-2"></i>Thêm món
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Món ăn</th>
                <th className="text-center">Giá</th>
                <th className="text-end pe-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {foods.map(food => (
                <tr key={food.id}>
                  <td className="ps-3">
                    <div className="d-flex align-items-center">
                      <img 
                        src={food.image_url ? `${SERVER_URL}${food.image_url}` : 'https://via.placeholder.com/50'} 
                        alt="" 
                        className="rounded me-3 border" 
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=Err'; }}
                      />
                      <div className="fw-bold">{food.name}</div>
                    </div>
                  </td>
                  <td className="text-center fw-bold text-danger">${parseFloat(food.price).toFixed(2)}</td>
                  <td className="text-end pe-3">
                    <button onClick={() => handleOpenModal(food)} className="btn btn-sm btn-outline-primary me-2">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button onClick={() => handleDelete(food.id)} className="btn btn-sm btn-outline-danger">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FoodModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSubmit}
        loading={loading}
      />
    </div>
  );
}