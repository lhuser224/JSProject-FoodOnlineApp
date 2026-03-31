import { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import styles from './Home.module.css';

export default function SidebarFilter({ filters, setFilters, onClear }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAllCategories({ is_active: 1 });
        const data = res?.data?.data || res?.data || res || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };
    fetchCats();
  }, []);

  const handleCategoryToggle = (id) => {
    const numericId = Number(id); // Luôn làm việc với kiểu Number
    setFilters(prev => {
      const currentCats = prev.categoryIds || [];
      const isSelected = currentCats.includes(numericId);
      
      return {
        ...prev,
        categoryIds: isSelected
          ? currentCats.filter(catId => catId !== numericId)
          : [...currentCats, numericId]
      };
    });
  };

  return (
    <aside className={styles.sidebarWireframe}>
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>DANH MỤC</h4>
        <div className={styles.categoryList}>
          {categories.map(cat => (
            <label key={cat.id} className={styles.optItem}>
              <input 
                type="checkbox" 
                checked={(filters.categoryIds || []).includes(Number(cat.id))}
                onChange={() => handleCategoryToggle(cat.id)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>KHOẢNG GIÁ</h4>
        <div className={styles.priceInputs}>
          <input 
            type="number" 
            min="0"
            className={styles.priceBox} 
            placeholder="Từ..." 
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({...prev, minPrice: e.target.value}))}
          />
          <span className={styles.priceDivider}>-</span>
          <input 
            type="number" 
            min="0"
            className={styles.priceBox} 
            placeholder="Đến..." 
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({...prev, maxPrice: e.target.value}))}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>SẮP XẾP THEO</h4>
        <select 
          className={styles.sortSelect}
          value={filters.sortBy} 
          onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value}))}
        >
          <option value="">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến Cao</option>
          <option value="price_desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      <div className={styles.filterActions}>
        <button 
          className={styles.clearFilterBtn} 
          onClick={onClear}
        >
          LÀM MỚI BỘ LỌC
        </button>
      </div>
    </aside>
  );
}