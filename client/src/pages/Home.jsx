import React, { useState, useCallback, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import foodService from '../services/foodService';
import styles from './Home.module.css';
import SearchBar from './SearchBar';
import SidebarFilter from './SidebarFilter';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal'; 

export default function Home() {
  const { state, dispatch } = useContext(AppContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({ 
    minPrice: '', 
    maxPrice: '', 
    sortBy: 'Nearest', 
    categoryId: null 
  });

  const loadFoods = useCallback(async () => {
    try {
      setLoading(true);
      
      const user = JSON.parse(localStorage.getItem('user')) || {};

      const params = {
        search: searchTerm,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        category_id: filters.categoryId,
        sort: filters.sortBy,
        user_province: user.province,
        user_district: user.district,
        strict_location: true 
      };

      const res = await foodService.getFoods(params);
      const data = res?.data || res || [];
      setFoods(data); 
    } catch (error) {
      console.error("Lỗi tải món ăn:", error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const handleClearFilter = () => {
    setFilters({ minPrice: '', maxPrice: '', sortBy: 'Nearest', categoryId: null });
    setSearchTerm('');
  };

  const addToCart = (payload) => {
    dispatch({ type: 'ADD_TO_CART', payload });
  };

  const quickAddToCart = (product) => {
    const price = Number(product.price) || 0;
    const shopInfo = product.shop || {}; 
    
    addToCart({ 
      ...product,
      food_id: product.id,
      quantity: 1, 
      price: price,
      totalPrice: price,
      selected_options: {},
      shop: shopInfo 
    });
  };

  return (
    <div className={styles.homeLayout}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Đặt Đồ Ăn, Giao Nhanh 20 Phút</h1>
          <div className={styles.searchArea}>
            <SearchBar 
              onSearch={(val) => setSearchTerm(val)} 
              initialValue={searchTerm} 
            />
          </div>
        </div>
      </div>

      <div className={styles.mainContentArea}>
        <SidebarFilter 
          filters={filters} 
          setFilters={setFilters} 
          onApply={loadFoods} 
          onClear={handleClearFilter} 
        />
        
        <main className={styles.productSection}>
          <div className={styles.sectionHead}>
            <h3>
              {searchTerm 
                ? `Kết quả tìm kiếm cho "${searchTerm}"` 
                : "Món ngon gần bạn"}
            </h3>
          </div>

          {loading ? (
            <div className={styles.statusMsg}>Đang tìm kiếm món ăn phù hợp...</div>
          ) : foods.length > 0 ? (
            <div className={styles.gridV2}>
              {foods.map((f) => (
                <ProductCard 
                  key={f.id} 
                  product={f} 
                  onClick={() => setSelectedProduct(f)} 
                  onQuickAdd={quickAddToCart} 
                />
              ))}
            </div>
          ) : (
            <div className={styles.statusMsg}>
              Không tìm thấy món ăn nào ở khu vực của bạn.
            </div>
          )}
        </main>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}