import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { getFoods, searchFoods } from '../services/foodService';
import styles from './Home.module.css';

function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedToppings, setSelectedToppings] = useState([]);

  const basePriceWithSize = selectedSize === 'L' ? product.price + 2 : product.price;
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalImageBox}>
          <i className="fa-solid fa-utensils fa-4x" style={{ color: '#ccc' }}></i>
          <button onClick={onClose} className={styles.modalCloseBtn}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <h2>{product.name}</h2>
          <div className={styles.optionsScroll}>
            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Chọn Size</strong>
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
                  <span>+ ${size === 'L' ? '2.00' : '0.00'}</span>
                </label>
              ))}
            </div>

            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}><strong>Topping thêm</strong></div>
              <label className={styles.optItem}>
                <span>
                  <input type="checkbox" onChange={() => handleToppingChange('Egg')} /> Thêm trứng
                </span>
                <span>+ $1.00</span>
              </label>
              <label className={styles.optItem}>
                <span>
                  <input type="checkbox" onChange={() => handleToppingChange('Cheese')} /> Thêm phô mai
                </span>
                <span>+ $1.50</span>
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <div className={styles.quantityEditor}>
              <button className={styles.quantityBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button className={styles.quantityBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button 
              className={styles.addToCartBtn} 
              onClick={() => onAddToCart({ ...product, size: selectedSize, extras: selectedToppings, quantity, totalPrice, selected_options: { size: selectedSize, extras: selectedToppings } })}
            >
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
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const res = await getFoods(1);
      const data = res?.data || res || [];
      setFoods(data.length > 0 ? data : (state.products || []));
    } catch {
      setFoods(state.products || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return loadFoods();
    try {
      setLoading(true);
      const res = await searchFoods(searchTerm);
      const data = res?.data || res || [];
      setFoods(data);
    } catch {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (payload) => {
    dispatch({ type: 'ADD_TO_CART', payload });
  };

  return (
    <>
      <Navbar />
      <div className={styles.heroWrapper}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Đặt Đồ Ăn, Giao Hàng Nhanh</h1>
          <div className={styles.searchBoxLarge}>
            <input
              type="text"
              placeholder="Tìm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={styles.btnSearch} onClick={handleSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.mainContentArea}>
        <main className={styles.productSection}>
          {loading ? (
            <div className={styles.loading}>Đang tải...</div>
          ) : (
            <div className={styles.gridV2}>
              {foods.map((product) => (
                <div key={product.id} className={styles.cardV2} onClick={() => setSelectedProduct(product)}>
                  <div className={styles.cardThumb}>
                    {product.image_url ? <img src={product.image_url} alt={product.name} /> : <div className={styles.imgPlaceholder}><i className="fa-solid fa-utensils"></i></div>}
                  </div>
                  <div className={styles.cardDetails}>
                    <h4 className={styles.foodName}>{product.name}</h4>
                    <div className={styles.cardBottom}>
                      <div className={styles.priceTag}>${product.price.toFixed(2)}</div>
                      <button className={styles.btnPlus} onClick={(e) => { 
                        e.stopPropagation(); 
                        addToCart({ ...product, quantity: 1, totalPrice: product.price, selected_options: {} }); 
                      }}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(data) => { addToCart(data); setSelectedProduct(null); }}
        />
      )}
    </>
  );
}