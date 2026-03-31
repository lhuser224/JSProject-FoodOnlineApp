import { useState, useEffect } from 'react';
import OptionManager from './OptionManager';
import categoryService from '../services/categoryService';

const SERVER_URL = 'http://localhost:3000';

export default function FoodModal({ show, onClose, formData, setFormData, onSave, loading }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (show) {
      const fetchCategories = async () => {
        try {
          const res = await categoryService.getAllCategories();
          if (res && res.success) {
            setCategories(res.data);
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh mục:", error);
        }
      };
      fetchCategories();
    }
  }, [show]);

  if (!show) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        image_url: URL.createObjectURL(file)
      });
    }
  };

  const getImageUrl = () => {
    if (!formData.image_url) return 'https://via.placeholder.com/150?text=No+Image';
    if (formData.image_url.startsWith('blob:') || formData.image_url.startsWith('http')) {
      return formData.image_url;
    }
    return `${SERVER_URL}${formData.image_url}`;
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title fw-bold">
                {formData.id ? 'Chỉnh sửa món ăn' : 'Thêm món mới'}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
              <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Tên món ăn</label>
                      <input 
                        type="text" className="form-control" required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ví dụ: Cơm tấm sườn bì chả"
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Giá bán ($)</label>
                        <input 
                          type="number" className="form-control" required
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Danh mục</label>
                        <select 
                          className="form-select"
                          value={formData.category_id}
                          onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 text-center">
                    <label className="form-label fw-bold d-block">Ảnh minh họa</label>
                    <div className="position-relative mb-2">
                      <div className="border bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '100%', height: '150px', overflow: 'hidden' }}>
                        <img 
                          src={getImageUrl()} 
                          alt="Preview" 
                          className="w-100 h-100" style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <input 
                        type="file" id="fileInput" hidden accept="image/*"
                        onChange={handleFileChange}
                      />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-dark position-absolute bottom-0 end-0 m-2"
                        onClick={() => document.getElementById('fileInput').click()}
                      >
                        <i className="fa-solid fa-camera"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <OptionManager 
                  foodId={formData.id}
                  shopId={formData.shop_id}
                  options={formData.options || []} 
                  setOptions={(newOptions) => setFormData({...formData, options: newOptions})} 
                />
              </div>

              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Hủy</button>
                <button type="submit" className="btn btn-danger px-4" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Lưu...</>
                  ) : 'Xác nhận món'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}