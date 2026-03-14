import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = cart.length;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLogo} onClick={() => navigate('/')}>
        Food App
      </div>
      <div className={styles.navLinks}>
        <i
          className="fa-solid fa-user"
          onClick={() => navigate('/auth')}
        ></i>
        <i
          className="fa-solid fa-clock-rotate-left"
          onClick={() => navigate('/history')}
        ></i>
        <i
          className="fa-solid fa-cart-shopping"
          onClick={() => navigate('/checkout')}
        >
          <span className={styles.cartBadge}>{cartCount}</span>
        </i>
      </div>
    </nav>
  );
}
