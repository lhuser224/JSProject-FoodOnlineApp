import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = cart.length;

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate('/')}>
        Food App
      </div>
      <div className="nav-links">
        <i
          className="fa-solid fa-user"
          onClick={() => navigate('/auth')}
          style={{ cursor: 'pointer' }}
        ></i>
        <i
          className="fa-solid fa-clock-rotate-left"
          onClick={() => navigate('/history')}
          style={{ cursor: 'pointer' }}
        ></i>
        <i
          className="fa-solid fa-cart-shopping"
          onClick={() => navigate('/checkout')}
          style={{ cursor: 'pointer' }}
        >
          <span id="cart-badge">{cartCount}</span>
        </i>
      </div>
    </nav>
  );
}
