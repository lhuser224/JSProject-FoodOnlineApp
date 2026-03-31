import { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import styles from './Home.module.css';

export default function SidebarFilter({ filters, setFilters, onApply, onClear }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await categoryService.getAllCategories({ is_active: 1 });
      setCategories(res?.data || []);
    };
    fetchCats();
  }, []);

  const handlePriceChange = (field, value) => {
    const numValue = Math.max(0, parseFloat(value) || 0);
    setFilters(prev => ({ ...prev, [field]: value === '' ? '' : numValue }));
  };

  return (
    <aside className={styles.sidebarWireframe}>
      <div className={styles.filterSection}>
        <h4>CATEGORIES</h4>
        <div className={styles.categoryList}>
          {categories.map(cat => (
            <label key={cat.id} className={styles.optItem}>
              <input 
                type="checkbox" 
                checked={filters.categoryId === cat.id}
                onChange={() => setFilters({...filters, categoryId: cat.id})}
              /> {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>PRICE RANGE ($)</h4>
        <div className={styles.priceInputs}>
          <input 
            type="number" min="0"
            className={styles.priceBox} placeholder="Min" 
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
          />
          <input 
            type="number" min="0"
            className={styles.priceBox} placeholder="Max" 
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>SORT BY</h4>
        <select value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})}>
          <option value="Nearest">Gần nhất (Vị trí)</option>
          <option value="price_asc">Giá: Thấp đến Cao</option>
          <option value="price_desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      <div className={styles.filterActions}>
        <button className={styles.applyFilterBtn} onClick={onApply}>LỌC</button>
        <button className={styles.clearFilterBtn} onClick={onClear}>Xóa hết</button>
      </div>
    </aside>
  );
}