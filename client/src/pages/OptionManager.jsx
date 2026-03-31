import React, { useEffect, useState } from 'react';
import optionService from '../services/optionService';

export default function OptionManager({ foodId, shopId, options = [], setOptions }) {
  const [libraryGroups, setLibraryGroups] = useState([]); // Tất cả nhóm của Shop

  useEffect(() => {
    if (shopId) {
      fetchLibrary();
    }
  }, [shopId, foodId]);

  const fetchLibrary = async () => {
    try {
      // Lấy tất cả nhóm của shop
      const res = await optionService.getGroupsByShop(shopId);
      setLibraryGroups(res.data || []);
      
      // Nếu đang sửa món ăn, lấy danh sách nhóm đã gán cho món đó
      if (foodId) {
        const assigned = await optionService.getFoodCustomization(foodId);
        setOptions(assigned.data || []);
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleAssign = async (groupId, isAssigned) => {
    try {
      if (isAssigned) {
        await optionService.removeFromFood(foodId, groupId);
      } else {
        await optionService.assignToFood(foodId, groupId);
      }
      fetchLibrary(); // Refresh để cập nhật trạng thái
    } catch (err) { alert("Lỗi khi thay đổi liên kết"); }
  };

  return (
    <div className="option-section border rounded p-3 bg-white">
      <h6 className="fw-bold text-primary mb-3">Thư viện Tùy chọn của Quán</h6>
      
      <div className="list-group mb-3">
        {libraryGroups.map(group => {
          const isSelected = options.some(o => o.id === group.id);
          return (
            <div key={group.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <input 
                  type="checkbox" 
                  className="form-check-input me-2" 
                  checked={isSelected}
                  onChange={() => handleToggleAssign(group.id, isSelected)}
                  disabled={!foodId} // Chỉ cho gán khi đã có Food ID (đã lưu món)
                />
                <span className="fw-bold">{group.name}</span>
                <small className="text-muted ms-2">({group.items?.length || 0} lựa chọn)</small>
              </div>
              <button type="button" className="btn btn-sm btn-link text-danger">Sửa nhóm</button>
            </div>
          );
        })}
      </div>

      <button 
        type="button" 
        className="btn btn-sm btn-outline-primary w-100"
        onClick={() => {/* Mở modal tạo nhóm mới cho Shop */}}
      >
        + Tạo nhóm tùy chọn mới cho Thư viện
      </button>

      {!foodId && <p className="text-warning small mt-2">* Vui lòng lưu món ăn trước khi gán tùy chọn.</p>}
    </div>
  );
}