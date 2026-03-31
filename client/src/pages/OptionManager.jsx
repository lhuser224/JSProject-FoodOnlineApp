import React, { useEffect, useState } from 'react';
import optionService from '../services/optionService';

export default function OptionManager({ foodId, shopId, options = [], setOptions }) {
  const [libraryGroups, setLibraryGroups] = useState([]);

  useEffect(() => {
    if (shopId) {
      fetchLibrary();
    }
  }, [shopId, foodId]);

  const fetchLibrary = async () => {
    try {
      const res = await optionService.getGroupsByShop(shopId);
      // Giả định axiosClient của bạn trả về data trực tiếp hoặc res.data
      setLibraryGroups(res.data || res || []);
      
      if (foodId) {
        const assigned = await optionService.getFoodCustomization(foodId);
        setOptions(assigned.data || assigned || []);
      }
    } catch (err) { 
      console.error("Lỗi tải thư viện tùy chọn:", err); 
    }
  };

  // Hàm xử lý thêm nhóm tùy chọn mới vào thư viện của quán
  const handleAddNewLibraryGroup = async () => {
    const groupName = prompt("Nhập tên nhóm tùy chọn mới (VD: Topping, Mức độ cay, Size):");
    
    if (!groupName || groupName.trim() === "") return;

    try {
      const newGroup = {
        shop_id: shopId,
        name: groupName.trim(),
        is_required: false,
        is_multiple: true,
        max_choices: null
      };

      const res = await optionService.createGroup(newGroup);
      if (res) {
        alert("Đã thêm nhóm tùy chọn mới vào thư viện thành công!");
        fetchLibrary(); // Refresh danh sách
      }
    } catch (err) {
      console.error("Lỗi khi tạo nhóm:", err);
      alert("Không thể thêm tùy chọn mới");
    }
  };

  const handleToggleAssign = async (groupId, isAssigned) => {
    try {
      if (isAssigned) {
        await optionService.removeFromFood(foodId, groupId);
      } else {
        await optionService.assignToFood(foodId, groupId);
      }
      fetchLibrary();
    } catch (err) { 
      alert("Lỗi khi thay đổi liên kết tùy chọn"); 
    }
  };

  return (
    <div className="option-section border rounded p-3 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-primary mb-0">Thư viện Tùy chọn của Quán</h6>
        <span className="badge bg-light text-dark border">Shop ID: {shopId}</span>
      </div>
      
      <div className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {libraryGroups.length > 0 ? libraryGroups.map(group => {
          const isSelected = options.some(o => o.id === group.id);
          const inputId = `opt-check-${group.id}`;
          return (
            <div key={group.id} className="list-group-item d-flex justify-content-between align-items-center py-2">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  checked={isSelected}
                  onChange={() => handleToggleAssign(group.id, isSelected)}
                  disabled={!foodId}
                  id={inputId}
                />
                <label className="form-check-label fw-bold" htmlFor={inputId}>
                  {group.name}
                  <small className="text-muted ms-2">
                    ({group.items?.length || 0} mục)
                  </small>
                </label>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-3 text-muted small">Chưa có tùy chọn nào trong thư viện</div>
        )}
      </div>

      <button 
        type="button" 
        className="btn btn-sm btn-outline-primary w-100"
        onClick={handleAddNewLibraryGroup}
      >
        <i className="fa-solid fa-plus me-1"></i> Thêm Tùy chọn mới vào Thư viện
      </button>

      {!foodId && (
        <div className="alert alert-warning p-2 mt-2 small mb-0">
          <i className="fa-solid fa-circle-info me-1"></i>
          Lưu món ăn trước khi gán các tùy chọn từ thư viện.
        </div>
      )}
    </div>
  );
}