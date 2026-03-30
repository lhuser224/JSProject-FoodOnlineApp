import { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import foodService from '../services/foodService';
import styles from './Home.module.css';

function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedToppings, setSelectedToppings] = useState([]);
  
  const basePriceWithSize = selectedSize === 'L' ? (product.price || 0) + 2 : (product.price || 0);
  const toppingPrice = selectedToppings.reduce((sum, topping) => {
    if (topping === 'Egg') return sum + 1;
    if (topping === 'Cheese') return sum + 1.5;
    return sum;
  }, 0);
  const totalPrice = (basePriceWithSize + toppingPrice) * quantity;

  const handleToppingChange = (topping) => {
    setSelectedToppings(prev => 
      prev.includes(topping) ? prev.filter(t => t !== topping) : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      food_id: product.id,
      size: selectedSize,
      extras: selectedToppings,
      quantity,
      totalPrice,
      selected_options: { size: selectedSize, extras: selectedToppings }
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalImageBox}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className={styles.modalImg} />
          ) : (
            <i className="fa-solid fa-utensils fa-4x" style={{ color: '#ccc' }}></i>
          )}
          <button onClick={onClose} className={styles.modalCloseBtn}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <h2>{product.name}</h2>
          <p className={styles.modalDesc}>Món ăn được chế biến từ nguyên liệu tươi ngon nhất.</p>
          <div className={styles.optionsScroll}>
            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Chọn Size</strong>
                <span className={styles.optGroupRequired}>Bắt buộc</span>
              </div>
              {['M', 'L'].map(size => (
                <label key={size} className={styles.optItem}>
                  <span>
                    <input 
                      type="radio" 
                      name="size" 
                      checked={selectedSize === size} 
                      onChange={() => setSelectedSize(size)} 
                    /> Size {size}
                  </span>
                  <span className={styles.optPrice}>+ ${size === 'L' ? '2.00' : '0.00'}</span>
                </label>
              ))}
            </div>
            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Topping thêm</strong>
                <span style={{ fontSize: '0.7rem', color: '#999' }}>Tùy chọn</span>
              </div>
              <label className={styles.optItem}>
                <span>
                  <input type="checkbox" checked={selectedToppings.includes('Egg')} onChange={() => handleToppingChange('Egg')} /> Thêm trứng
                </span>
                <span className={styles.optPrice}>+ $1.00</span>
              </label>
              <label className={styles.optItem}>
                <span>
                  <input type="checkbox" checked={selectedToppings.includes('Cheese')} onChange={() => handleToppingChange('Cheese')} /> Thêm phô mai
                </span>
                <span className={styles.optPrice}>+ $1.50</span>
              </label>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <div className={styles.quantityControl}>
              <button className={styles.quantityBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button className={styles.quantityBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button onClick={handleAddToCart} className={styles.addToCartBtn}>
              Thêm vào giỏ - ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'Nearest'
  });
  
  const { state, dispatch } = useContext(AppContext);

  const loadFoods = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        sort: filters.sortBy
      };
      const res = await foodService.getFoods(params);
      const data = res?.data || res || [];
      setFoods(data.length > 0 ? data : (state.products || []));
    } catch (error) {
      setFoods(state.products || []);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, state.products]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const addToCart = (payload) => {
    dispatch({ type: 'ADD_TO_CART', payload });
  };

  const quickAddToCart = (product) => {
    addToCart({ 
      ...product,
      food_id: product.id,
      quantity: 1, 
      totalPrice: product.price, 
      selected_options: { size: 'M', extras: [] } 
    });
  };

  const handleClearFilter = () => {
    setFilters({ minPrice: '', maxPrice: '', sortBy: 'Nearest' });
    setSearchTerm('');
  };

  return (
    <div className={styles.homeLayout}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Đặt Đồ Ăn, Giao Nhanh 20 Phút</h1>
          <div className={styles.searchBoxLarge}>
            <input
              type="text"
              placeholder="Tìm địa điểm, món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadFoods()}
            />
            <button className={styles.btnSearch} onClick={loadFoods}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className={styles.quickTags}>
            {['All', 'Đồ ăn', 'Đồ uống', 'Đồ chay'].map((tag, idx) => (
              <span key={idx} className={`${styles.tag} ${idx === 0 ? styles.active : ''}`}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.mainContentArea}>
        <aside className={styles.sidebarWireframe}>
          <div className={styles.filterTitle}>
            <span>Filter</span>
            <i className="fa-solid fa-filter"></i>
          </div>

          <div className={styles.filterSection}>
            <h4>PRICE RANGE ($)</h4>
            <div className={styles.priceInputs}>
              <input 
                type="number" 
                className={styles.priceBox} 
                placeholder="Min" 
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
              <span className={styles.dash}>-</span>
              <input 
                type="number" 
                className={styles.priceBox} 
                placeholder="Max" 
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4>SORT BY</h4>
            <div className={styles.sortBox}>
              <select 
                value={filters.sortBy} 
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="Nearest">Nearest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className={styles.filterActions}>
            <button className={styles.applyFilterBtn} onClick={loadFoods}>APPLY FILTER</button>
            <button className={styles.clearFilterBtn} onClick={handleClearFilter}>Clear all</button>
          </div>
        </aside>

        <main className={styles.productSection}>
          <div className={styles.sectionHead}>
            <h3>Ưu đãi hôm nay</h3>
          </div>

          {loading ? (
            <div className={styles.statusMsg}>Đang tải món ăn...</div>
          ) : foods.length > 0 ? (
            <div className={styles.gridV2}>
              {foods.map((product) => (
                <div 
                  key={product.id} 
                  className={styles.cardV2} 
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className={styles.cardThumb}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <div className={styles.imgPlaceholder}><i className="fa-solid fa-utensils"></i></div>
                    )}
                    {product.status === 'available' && <div className={styles.badgeDeal}>-15k</div>}
                    <div className={styles.overlayHover}>
                      <span>Xem chi tiết</span>
                    </div>
                  </div>
                  <div className={styles.cardDetails}>
                    <h4 className={styles.foodName}>{product.name}</h4>
                    <p className={styles.foodAddress}>{product.address || 'Hồ Chí Minh'}</p>
                    <div className={styles.cardBottom}>
                      <div className={styles.priceTag}>${product.price?.toFixed(2)}</div>
                      <button 
                        className={styles.btnPlus} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          quickAddToCart(product);
                        }}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.statusMsg}>Không tìm thấy món ăn nào.</div>
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