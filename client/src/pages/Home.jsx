import React, { useState, useCallback, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import foodService from '../services/foodService';
import styles from './Home.module.css';
import SearchBar from './SearchBar';
import SidebarFilter from './SidebarFilter';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

export default function Home() {
  const { dispatch } = useContext(AppContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [filters, setFilters] = useState({ 
    minPrice: '', 
    maxPrice: '', 
    sortBy: '', 
    categoryIds: [] 
  });

  // State trung gian để debounce
  const [debouncedParams, setDebouncedParams] = useState(filters);

  // Logic Debounce: Chỉ cập nhật debouncedParams sau 500ms ngừng gõ
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedParams({ ...filters, search: searchTerm });
    }, 500);
    return () => clearTimeout(handler);
  }, [filters, searchTerm]);

  const loadFoods = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user')) || {};

      // Tạo object params sạch để gửi API
      const params = {
        search: debouncedParams.search || undefined,
        minPrice: debouncedParams.minPrice || undefined,
        maxPrice: debouncedParams.maxPrice || undefined,
        sortBy: debouncedParams.sortBy || undefined,
      };

      // Chuyển mảng [1,2] thành chuỗi "1,2" cho Backend
      if (debouncedParams.categoryIds && debouncedParams.categoryIds.length > 0) {
        params.category_ids = debouncedParams.categoryIds.join(',');
      }

      const res = await foodService.getFoods(params);
      
      // Kiểm tra cấu trúc trả về (phụ thuộc vào Axios Interceptor của bạn)
      // Nếu axiosClient trả về response.data trực tiếp thì dùng res.data
      const responseData = res?.data || res; 
      const finalItems = Array.isArray(responseData) ? responseData : (responseData.data || []);
      
      setFoods(finalItems);
    } catch (error) {
      console.error("Lỗi loadFoods:", error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedParams]);
  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const handleClearFilter = () => {
    setFilters({ minPrice: '', maxPrice: '', sortBy: '', categoryIds: [] });
    setSearchTerm('');
  };

  return (
    <div className={styles.homeLayout}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>FoodO - Đặt gì cũng có</h1>
          <SearchBar onSearch={setSearchTerm} initialValue={searchTerm} />
        </div>
      </div>

      <div className={styles.mainContentArea}>
        <SidebarFilter 
          filters={filters} 
          setFilters={setFilters} 
          onClear={handleClearFilter} 
        />
        
        <main className={styles.productSection}>
          {loading ? (
            <div className={styles.statusMsg}>Đang tìm món ngon...</div>
          ) : (
            <div className={styles.gridV2}>
              {foods.map((f) => (
                <ProductCard 
                  key={f.id} 
                  product={f} 
                  onClick={() => setSelectedProduct(f)} 
                  onQuickAdd={(p) => dispatch({ type: 'ADD_TO_CART', payload: { ...p, quantity: 1 } })} 
                />
              ))}
            </div>
          )}
          {!loading && foods.length === 0 && (
            <div className={styles.statusMsg}>Không tìm thấy món bạn yêu cầu.</div>
          )}
        </main>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => dispatch({ type: 'ADD_TO_CART', payload: p })}
        />
      )}
    </div>
  );
}