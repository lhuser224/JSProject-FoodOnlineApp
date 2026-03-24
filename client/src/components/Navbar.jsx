import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state } = useContext(AppContext);
  const cartCount = state.cart?.length || 0;

  const onLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-danger d-flex align-items-center" to="/">
          <i className="fa-solid fa-utensils me-2"></i>
          <span>FoodO</span>
        </Link>

        {/* Right Icons */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/checkout" className="nav-link p-2 text-secondary position-relative">
            <i className="fa-solid fa-cart-shopping fs-5"></i>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <div className="dropdown">
              {/* Nút kích hoạt Dropdown */}
              <div 
                className="d-flex align-items-center ps-2" 
                id="userDropdown"
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <div className="text-end me-2 d-none d-sm-block">
                  <div className="fw-bold small text-dark">{user.full_name}</div>
                  <small className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`} style={{fontSize: '0.6rem'}}>
                    {user.role?.toUpperCase()}
                  </small>
                </div>
                <i className="fa-solid fa-circle-user fs-3 text-secondary"></i>
              </div>

              {/* Danh sách Menu */}
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userDropdown">
                <li className="px-3 py-2 border-bottom d-sm-none">
                  <div className="fw-bold">{user.full_name}</div>
                  <small className="text-muted">{user.role}</small>
                </li>
                
                {user.role === 'admin' && (
                  <li><Link className="dropdown-item py-2" to="/admin/dashboard"><i className="fa-solid fa-gauge me-2"></i>Admin Dashboard</Link></li>
                )}
                
                <li><Link className="dropdown-item py-2" to="/profile"><i className="fa-solid fa-user me-2"></i>Hồ sơ</Link></li>
                <li><Link className="dropdown-item py-2" to="/history"><i className="fa-solid fa-box me-2"></i>Đơn hàng</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item py-2 text-danger fw-bold" onClick={onLogout}>
                    <i className="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-danger btn-sm px-4 rounded-pill">Đăng nhập</Link>
          )}
        </div>
      </div>
    </nav>
  );
}