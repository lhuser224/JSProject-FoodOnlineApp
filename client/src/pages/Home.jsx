import { useState } from 'react';
import { useCart } from '../hooks/useStore';
import { useAppStore } from '../hooks/useStore';
import Navbar from '../components/Navbar';
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
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter(t => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      size: selectedSize,
      extras: selectedToppings,
      quantity: quantity,
      totalPrice: totalPrice
    });
    onClose();
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalImageBox}>
          <i
            className="fa-solid fa-utensils fa-4x"
            style={{ color: '#ccc' }}
          ></i>
          <button
            onClick={onClose}
            className={styles.modalCloseBtn}
          >
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <h2>{product.name}</h2>
          <p>
            Mô tả: Món ăn được chế biến từ nguyên liệu tươi ngon nhất trong ngày.
          </p>

          <div className={styles.optionsScroll}>
            {/* Size Selection */}
            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Chọn Size</strong>
                <span className={styles.optGroupRequired}>
                  Bắt buộc
                </span>
              </div>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="radio"
                    name="size"
                    value="M"
                    checked={selectedSize === 'M'}
                    onChange={() => setSelectedSize('M')}
                  />{' '}
                  Size M
                </span>
                <span>+ $0.00</span>
              </label>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="radio"
                    name="size"
                    value="L"
                    checked={selectedSize === 'L'}
                    onChange={() => setSelectedSize('L')}
                  />{' '}
                  Size L
                </span>
                <span>+ $2.00</span>
              </label>
            </div>

            {/* Toppings */}
            <div className={styles.optGroup}>
              <div className={styles.optGroupHeader}>
                <strong>Topping thêm</strong>
              </div>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes('Egg')}
                    onChange={() => handleToppingChange('Egg')}
                  />{' '}
                  Thêm trứng
                </span>
                <span>+ $1.00</span>
              </label>
              <label className={styles.optItem}>
                <span>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes('Cheese')}
                    onChange={() => handleToppingChange('Cheese')}
                  />{' '}
                  Thêm phô mai
                </span>
                <span>+ $1.50</span>
              </label>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

          <div className={styles.modalFooter}>
            <div className={styles.quantityControl}>
              <button
                className={styles.quantityBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className={styles.quantityDisplay}>{quantity}</span>
              <button
                className={styles.quantityBtn}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={styles.addToCartBtn}
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
  const { products } = useAppProducts();
  const { addToCart } = useCart();

  const handleQuickAdd = (product) => {
    addToCart(product);
    alert(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleAddToCartFromModal = (productWithOptions) => {
    addToCart(productWithOptions);
    alert(`Đã thêm món vào giỏ hàng!`);
  };

  return (
    <>
      <Navbar />

      <div className={styles.heroWrapper}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Đặt Đồ Ăn, Giao Hàng Nhanh Chỉ Từ 20 phút</h1>
          <p className={styles.heroSubtitle}>Có 10,000+ Địa điểm ở TP. HCM từ 00:00 - 23:59</p>

          <div className={styles.searchBoxLarge}>
            <input type="text" placeholder="Tìm địa điểm, món ăn, địa chỉ..." />
            <button className={styles.btnSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          <div className={styles.quickTags}>
            <span className={`${styles.tag} ${styles.active}`}>All</span>
            <span className={styles.tag}>Đồ ăn</span>
            <span className={styles.tag}>Đồ uống</span>
            <span className={styles.tag}>Đồ chay</span>
            <span className={styles.tag}>Bánh kem</span>
            <span className={styles.tag}>Tráng miệng</span>
            <span className={styles.tag}>Homemade</span>
            <span className={styles.tag}>Vỉa hè</span>
          </div>
        </div>
      </div>

      
      <div className={styles.mainContentArea}>
        <aside className={styles.sidebarWireframe}>
          <h3 className={styles.filterTitle}>Filters</h3>

          <div className={styles.filterSection}>
            <h4>Categories</h4>
            <label className={styles.checkboxRow}>
              <input type="checkbox" /> Food
            </label>
            <label className={styles.checkboxRow}>
              <input type="checkbox" /> Drink
            </label>
            <label className={styles.checkboxRow}>
              <input type="checkbox" /> Dessert
            </label>
          </div>

          <div className={styles.filterSection}>
            <h4>Price Range</h4>
            <div className={styles.priceInputs}>
              <input type="number" className={styles.priceBox} placeholder="Min" defaultValue="0" />
              <span className={styles.dash}>-</span>
              <input type="number" className={styles.priceBox} placeholder="Max" defaultValue="100" />
            </div>
            <input type="range" className={styles.rangeSlider} min="0" max="100" />
          </div>

          <div className={styles.filterSection}>
            <h4>Distance</h4>
            <label className={styles.checkboxRow}>
              <input type="checkbox" /> Under 1 km
            </label>
            <label className={styles.checkboxRow}>
              <input type="checkbox" /> 1 – 3 km
            </label>
            <label className={styles.checkboxRow}>
              <input type="checkbox" /> Over 3 km
            </label>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.sortBox}>
              <span>Sort by:</span>
              <select>
                <option>Nearest</option>
                <option>Price: Low to High</option>
                <option>Rating: High to Low</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary w-100 mt-20">Apply Filter</button>
        </aside>

        <main className={styles.productSection}>
          <div className={styles.sectionHead}>
            <h3>Ưu đãi hôm nay</h3>
          </div>

          <div className={styles.gridV2}>
            {products.map((product) => (
              <div
                key={product.id}
                className={styles.cardV2}
                onClick={() => setSelectedProduct(product)}
              >
                <div className={styles.cardThumb}>
                  <div className={styles.badgeDeal}>
                    <i className="fa-solid fa-ticket"></i> Giảm 15k
                  </div>
                  <div className={styles.badgeTime}>15 min</div>
                  <div className={styles.imgPlaceholder}>
                    <i className="fa-solid fa-utensils"></i>
                  </div>
                  <div className={styles.overlayHover}>Xem ngay</div>
                </div>
                <div className={styles.cardDetails}>
                  <h4 className={styles.foodName} title={product.name}>
                    <i className={`fa-solid fa-crown ${styles.textWarning}`}></i> {product.name}
                  </h4>
                  <p className={styles.foodAddress}>{product.address || 'Địa chỉ mặc định'}</p>
                  <div className={styles.cardMeta}>
                    <div className={styles.rating}>
                      <i className="fa-solid fa-star"></i> 4.8
                    </div>
                    <div>(999+)</div>
                  </div>
                  <div className={styles.cardBottom}>
                    <div className={styles.priceTag}>${product.price.toFixed(2)}</div>
                    <button
                      className={styles.btnPlus}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(product);
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </>
  );
}

// Helper function
function useAppProducts() {
  const { state } = useAppStore();
  return { products: state.products };
}