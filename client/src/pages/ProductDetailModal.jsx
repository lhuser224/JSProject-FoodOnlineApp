import { useState, useEffect } from 'react';
import optionService from '../services/optionService';
import styles from './Home.module.css';

const SERVER_URL = 'http://localhost:3000';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [optionGroups, setOptionGroups] = useState([]);
  const [selections, setSelections] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await optionService.getFoodCustomization(product.id);
        const data = res?.data || [];
        setOptionGroups(data);
        
        // Khởi tạo mặc định cho các nhóm Bắt buộc (Required)
        const initial = {};
        data.forEach(group => {
          if (group.is_required && group.items?.length > 0) {
            initial[group.id] = [group.items[0].id];
          }
        });
        setSelections(initial);
      } catch (error) {
        console.error("Lỗi lấy customization:", error);
      }
    };
    if (product?.id) fetchOptions();
  }, [product.id]);

  if (!product) return null;

  const handleSelect = (groupId, itemId, isRequired) => {
    setSelections(prev => {
      const current = prev[groupId] || [];
      if (isRequired) {
        return { ...prev, [groupId]: [itemId] };
      } else {
        const next = current.includes(itemId)
          ? current.filter(id => id !== itemId)
          : [...current, itemId];
        return { ...prev, [groupId]: next };
      }
    });
  };

  const calculateTotal = () => {
    let extraPrice = 0;
    optionGroups.forEach(group => {
      const selectedIds = selections[group.id] || [];
      group.items.forEach(item => {
        if (selectedIds.includes(item.id)) {
          extraPrice += Number(item.price || 0);
        }
      });
    });
    return (Number(product.price || 0) + extraPrice) * quantity;
  };

  const getImageUrl = () => {
    const path = product.image || product.image_url;
    if (!path) return 'https://via.placeholder.com/400x260?text=No+Image';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${SERVER_URL}${cleanPath}`;
  };

  const displayAddress = () => {
    const shop = product.shop || {};
    const parts = [
      product.address || shop.address,
      product.ward || shop.ward,
      product.district || shop.district,
      product.province || product.city || shop.province || shop.city
    ].filter(part => part && typeof part === 'string' && part.trim() !== '');

    return parts.length > 0 ? parts.join(', ') : 'Hồ Chí Minh';
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Nút đóng */}
        <button className={styles.modalCloseBtn} onClick={onClose}>&times;</button>

        {/* Khu vực ảnh */}
        <div className={styles.modalImageBox}>
          <img 
            src={getImageUrl()} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x260?text=Image+Error';
            }}
          />
        </div>

        {/* Nội dung chi tiết */}
        <div className={styles.modalBody}>
          <h2>{product.name}</h2>
          <p style={{ color: '#f15233', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>
            <i className="fa-solid fa-location-dot"></i> {displayAddress()}
          </p>
          <p>{product.description || "Món ăn tươi ngon được chế biến trong ngày."}</p>
          
          {optionGroups.map(group => (
            <div key={group.id} className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>{group.name}</strong>
                {group.is_required && <span className={styles.optGroupRequired}>Bắt buộc</span>}
              </div>
              
              {group.items?.map(item => (
                <div 
                  key={item.id} 
                  className={styles.optItem}
                  onClick={() => handleSelect(group.id, item.id, group.is_required)}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}>
                    <input 
                      type={group.is_required ? "radio" : "checkbox"} 
                      checked={(selections[group.id] || []).includes(item.id)}
                      readOnly
                    />
                    <span>{item.name}</span>
                  </label>
                  <span style={{ fontWeight: '600' }}>+${Number(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Chân Modal: Số lượng & Nút thêm */}
        <div className={styles.modalFooter}>
          <div className={styles.quantityControl}>
            <button 
              className={styles.quantityBtn} 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <div className={styles.quantityDisplay}>{quantity}</div>
            <button 
              className={styles.quantityBtn} 
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          <button 
            className={styles.addToCartBtn}
            onClick={() => onAddToCart({ 
              ...product, 
              selections, 
              quantity,
              totalPrice: calculateTotal() 
            })}
          >
            THÊM VÀO GIỎ - ${calculateTotal().toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}