import styles from './Home.module.css';

const SERVER_URL = 'http://localhost:3000';

export default function ProductCard({ product, onClick, onQuickAdd }) {
  
  const getImageUrl = () => {
    if (!product) return '';
    const path = product.image || product.image_url;
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${SERVER_URL}${cleanPath}`;
  };

  const displayAddress = () => {
    if (!product) return 'Hồ Chí Minh';
    const shop = product.shop || {};
    const parts = [
      product.address || shop.address,
      product.ward || shop.ward,
      product.district || shop.district,
      product.province || product.city || shop.province || shop.city
    ].filter(part => part && typeof part === 'string' && part.trim() !== '');

    return parts.length > 0 ? parts.join(', ') : 'Hồ Chí Minh';
  };

  const imgPath = getImageUrl();

  return (
    <div className={styles.cardV2} onClick={() => onClick(product)}>
      <div className={styles.cardThumb}>
        {imgPath ? (
          <img 
            src={imgPath} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300?text=Food+Image';
            }}
          />
        ) : (
          <div className={styles.imgPlaceholder}>
            <i className="fa-solid fa-utensils"></i>
          </div>
        )}
        <div className={styles.overlayHover}>Xem chi tiết</div>
      </div>
      
      <div className={styles.cardDetails}>
        <h4 className={styles.foodName}>{product.name}</h4>
        
        <p className={styles.foodAddress} title={displayAddress()}>
          <i className="fa-solid fa-location-dot" style={{ color: '#f15233', marginRight: '5px' }}></i>
          {displayAddress()}
        </p>

        <div className={styles.cardBottom}>
          <div className={styles.priceTag}>
            ${Number(product.price || 0).toFixed(2)}
          </div>
          <button 
            className={styles.btnPlus} 
            onClick={(e) => { 
              e.stopPropagation(); 
              onQuickAdd(product); 
            }}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
}