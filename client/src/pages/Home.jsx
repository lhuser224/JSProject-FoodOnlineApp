import { useState } from 'react';
import { useCart } from '../hooks/useStore';
import { useAppStore } from '../hooks/useStore';
import Navbar from '../components/Navbar';

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
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        className="modal-content detail-popup"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          width: '500px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          animation: 'slideUp 0.3s ease'
        }}
      >
        <div
          style={{
            height: '200px',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <i
            className="fa-solid fa-utensils fa-4x"
            style={{ color: '#ccc' }}
          ></i>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: '#fff',
              border: 'none',
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              fontSize: '18px'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 5px 0' }}>{product.name}</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
            Mô tả: Món ăn được chế biến từ nguyên liệu tươi ngon nhất trong ngày.
          </p>

          <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
            {/* Size Selection */}
            <div className="opt-group" style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}
              >
                <strong style={{ color: '#333' }}>Chọn Size</strong>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#ee4d2d',
                    background: '#fff1f0',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  Bắt buộc
                </span>
              </div>
              <label
                className="opt-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '12px 0',
                  cursor: 'pointer'
                }}
              >
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
                <span style={{ color: '#888' }}>+ $0.00</span>
              </label>
              <label
                className="opt-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '12px 0',
                  cursor: 'pointer'
                }}
              >
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
                <span style={{ color: '#888' }}>+ $2.00</span>
              </label>
            </div>

            {/* Toppings */}
            <div className="opt-group" style={{ marginBottom: '20px' }}>
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}
              >
                <strong style={{ color: '#333' }}>Topping thêm</strong>
              </div>
              <label
                className="opt-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '12px 0',
                  cursor: 'pointer'
                }}
              >
                <span>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes('Egg')}
                    onChange={() => handleToppingChange('Egg')}
                  />{' '}
                  Thêm trứng
                </span>
                <span style={{ color: '#888' }}>+ $1.00</span>
              </label>
              <label
                className="opt-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '12px 0',
                  cursor: 'pointer'
                }}
              >
                <span>
                  <input
                    type="checkbox"
                    checked={selectedToppings.includes('Cheese')}
                    onChange={() => handleToppingChange('Cheese')}
                  />{' '}
                  Thêm phô mai
                </span>
                <span style={{ color: '#888' }}>+ $1.50</span>
              </label>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  padding: '8px 15px',
                  border: 'none',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  padding: '8px 15px',
                  border: 'none',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{
                background: '#ee4d2d',
                border: 'none',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '8px 15px',
                borderRadius: '4px'
              }}
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

      <div className="hero-wrapper">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <h1 className="hero-title">Đặt Đồ Ăn, Giao Hàng Nhanh Chỉ Từ 20 phút</h1>
          <p className="hero-subtitle">Có 10,000+ Địa điểm ở TP. HCM từ 00:00 - 23:59</p>

          <div className="search-box-large">
            <input type="text" placeholder="Tìm địa điểm, món ăn, địa chỉ..." />
            <button className="btn-search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          <div className="quick-tags">
            <span className="tag active">All</span>
            <span className="tag">Đồ ăn</span>
            <span className="tag">Đồ uống</span>
            <span className="tag">Đồ chay</span>
            <span className="tag">Bánh kem</span>
            <span className="tag">Tráng miệng</span>
            <span className="tag">Homemade</span>
            <span className="tag">Vỉa hè</span>
          </div>
        </div>
      </div>

      <div className="container main-content-area">
        <aside className="sidebar-wireframe">
          <h3 className="filter-title">Filters</h3>

          <div className="filter-section">
            <h4>Categories</h4>
            <label className="checkbox-row">
              <input type="checkbox" /> Food
            </label>
            <label className="checkbox-row">
              <input type="checkbox" /> Drink
            </label>
            <label className="checkbox-row">
              <input type="checkbox" /> Dessert
            </label>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input type="number" className="price-box" placeholder="Min" defaultValue="0" />
              <span className="dash">-</span>
              <input type="number" className="price-box" placeholder="Max" defaultValue="100" />
            </div>
            <input type="range" className="range-slider" min="0" max="100" />
          </div>

          <div className="filter-section">
            <h4>Distance</h4>
            <label className="checkbox-row">
              <input type="checkbox" /> Under 1 km
            </label>
            <label className="checkbox-row">
              <input type="checkbox" /> 1 – 3 km
            </label>
            <label className="checkbox-row">
              <input type="checkbox" /> Over 3 km
            </label>
          </div>

          <div className="filter-section">
            <div className="sort-box">
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

        <main className="product-section">
          <div className="section-head">
            <h3>Ưu đãi hôm nay</h3>
          </div>

          <div className="grid-v2">
            {products.map((product) => (
              <div
                key={product.id}
                className="card-v2"
                onClick={() => setSelectedProduct(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-thumb">
                  <div className="badge-deal">
                    <i className="fa-solid fa-ticket"></i> Giảm 15k
                  </div>
                  <div className="badge-time">15 min</div>
                  <div className="img-placeholder">
                    <i className="fa-solid fa-utensils"></i>
                  </div>
                  <div className="overlay-hover">Xem ngay</div>
                </div>
                <div className="card-details">
                  <h4 className="food-name" title={product.name}>
                    <i className="fa-solid fa-crown text-warning"></i> {product.name}
                  </h4>
                  <p className="food-address">{product.address || 'Địa chỉ mặc định'}</p>
                  <div className="card-meta">
                    <div className="rating">
                      <i className="fa-solid fa-star"></i> 4.8
                    </div>
                    <div className="sold-count">(999+)</div>
                  </div>
                  <div className="card-bottom">
                    <div className="price-tag">${product.price.toFixed(2)}</div>
                    <button
                      className="btn-plus btn-add-fast"
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
