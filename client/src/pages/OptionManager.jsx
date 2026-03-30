import React, { useEffect } from 'react';
import optionService from '../services/optionService';

export default function OptionManager({ foodId, shopId, options = [], setOptions }) {
  
  useEffect(() => {
    if (foodId) {
      const fetchOptions = async () => {
        try {
          const res = await optionService.getFoodCustomization(foodId);
          setOptions(res.data || []); 
        } catch (err) {
          console.error("Lỗi lấy tùy chọn:", err);
        }
      };
      fetchOptions();
    }
  }, [foodId, setOptions]);

  const handleAddGroup = async () => {
    try {
      const payload = { 
        name: "Nhóm mới", 
        shop_id: shopId, 
        is_required: false 
      };
      
      const resGroup = await optionService.createGroup(payload);
      const newGroup = { ...resGroup.data, items: [] };

      await optionService.assignToFood(foodId, newGroup.id);

      setOptions([...options, newGroup]);
    } catch (err) {
      alert("Lỗi khi thêm nhóm tùy chọn");
    }
  };

  const handleAddItem = async (groupId) => {
    try {
      const payload = {
        group_id: groupId,
        name: "Tùy chọn mới",
        price: 0
      };
      
      const resItem = await optionService.addItem(payload);
      
      setOptions(options.map(g => 
        g.id === groupId ? { ...g, items: [...g.items, resItem.data] } : g
      ));
    } catch (err) {
      alert("Lỗi khi thêm lựa chọn lẻ");
    }
  };

  return (
    <div className="option-section border rounded p-3 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0 text-primary">
          <i className="fa-solid fa-list-check me-2"></i>Tùy chọn món ăn
        </h6>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddGroup}>
          + Thêm nhóm mới
        </button>
      </div>

      {options.length === 0 ? (
        <p className="text-center text-muted small py-3">Chưa có tùy chọn nào.</p>
      ) : (
        options.map((group) => (
          <div key={group.id} className="card mb-3 shadow-sm border-light">
            <div className="card-body p-3">
              <div className="fw-bold text-dark mb-2 d-flex justify-content-between">
                <span>{group.name} {group.is_required && <span className="badge bg-danger ms-1">Bắt buộc</span>}</span>
              </div>
              
              <div className="ms-3 border-start ps-3">
                {group.items && group.items.map(item => (
                  <div key={item.id} className="d-flex justify-content-between small text-secondary mb-1">
                    <span>• {item.name}</span>
                    <span>+{item.price.toLocaleString()}đ</span>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  className="btn btn-xs btn-link p-0 text-decoration-none mt-2"
                  onClick={() => handleAddItem(group.id)}
                >
                  <i className="fa-solid fa-plus me-1"></i>Thêm lựa chọn
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}