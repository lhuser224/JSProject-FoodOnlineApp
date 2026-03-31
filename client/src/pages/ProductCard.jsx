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
    const shop = product.shop || {};
    
    // Sửa tại đây: Database dùng 'shop_address' chứ không phải 'address'
    const detail = product.address || shop.shop_address; 
    const ward = product.ward || shop.ward;
    const district = product.district || shop.district;
    const province = product.province || product.city || shop.province || shop.city;

    // Lọc các phần tử không trống
    const addressParts = [detail, ward, district, province]
      .filter(part => part && typeof part === 'string' && part.trim() !== '');

    // Nếu mảng có dữ liệu thì nối lại bằng dấu phẩy, nếu không mới hiện mặc định
    return addressParts.length > 0 
      ? addressParts.join(', ') 
      : 'Hồ Chí Minh';
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
              e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
            }}
          />
        ) : (
          <div className={styles.imgPlaceholder}>
            <i className="fa-solid fa-utensils"></i>
          </div>
        )}
      </div>
      
      <div className={styles.cardDetails}>
        <h4>{product.name}</h4>
        {/* Hiển thị địa chỉ chi tiết */}
        <p className={styles.foodAddress} title={displayAddress()}>
          <i className="fa-solid fa-location-dot" style={{ fontSize: '0.8rem', marginRight: '4px' }}></i>
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