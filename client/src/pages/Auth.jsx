import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [state, setState] = useState('login'); // login | register | forgot
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    passwordConfirm: '',
    name: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = () => {
    if (!formData.phone || !formData.password) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    alert('Đăng nhập thành công!');
    navigate('/');
  };

  const handleRegister = () => {
    if (!formData.name || !formData.phone || !formData.password || !formData.passwordConfirm) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      alert('Mật khẩu không khớp!');
      return;
    }
    alert('Đăng ký thành công!');
    setState('login');
    setFormData({ phone: '', password: '', passwordConfirm: '', name: '' });
  };

  const handleForgot = () => {
    if (!formData.phone) {
      alert('Vui lòng nhập số điện thoại!');
      return;
    }
    alert('Mã xác nhận đã được gửi!');
    setState('login');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg">
        <div className="auth-bg-overlay">
          <h1>Food App</h1>
          <p>Đặt món thả ga - Freeship tận nhà</p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-box-modern">
          {state === 'login' && (
            <>
              <h2 className="auth-title">Đăng nhập</h2>
              <p className="auth-subtitle">Chào mừng bạn quay lại!</p>

              <div className="input-group">
                <i className="fa-solid fa-phone"></i>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <i className="fa-solid fa-eye show-pass"></i>
              </div>

              <div className="auth-actions">
                <label>
                  <input type="checkbox" /> Ghi nhớ tôi
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setState('forgot');
                  }}
                  className="link-highlight"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <button className="btn btn-primary w-100 btn-auth" onClick={handleLogin}>
                Đăng nhập
              </button>

              <div className="auth-footer">
                Chưa có tài khoản?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setState('register');
                  }}
                  className="link-highlight"
                >
                  Đăng ký ngay
                </a>
              </div>
            </>
          )}

          {state === 'register' && (
            <>
              <h2 className="auth-title">Tạo tài khoản</h2>
              <p className="auth-subtitle">Tham gia cộng đồng Food App ngay</p>

              <div className="input-group">
                <i className="fa-solid fa-user"></i>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <i className="fa-solid fa-phone"></i>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  id="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                />
              </div>

              <button className="btn btn-primary w-100 btn-auth" onClick={handleRegister}>
                Đăng ký
              </button>

              <div className="auth-footer">
                Đã có tài khoản?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setState('login');
                  }}
                  className="link-highlight"
                >
                  Đăng nhập
                </a>
              </div>
            </>
          )}

          {state === 'forgot' && (
            <>
              <h2 className="auth-title">Quên mật khẩu?</h2>
              <p className="auth-subtitle">Nhập SĐT để nhận mã OTP</p>

              <div className="input-group">
                <i className="fa-solid fa-phone"></i>
                <input
                  type="text"
                  placeholder="Số điện thoại đã đăng ký"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <button className="btn btn-primary w-100 btn-auth" onClick={handleForgot}>
                Gửi mã xác nhận
              </button>

              <div className="auth-footer">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setState('login');
                  }}
                  className="link-highlight"
                >
                  <i className="fa-solid fa-arrow-left"></i> Quay lại đăng nhập
                </a>
              </div>
            </>
          )}

          <div className="divider">
            <span>Hoặc đăng nhập bằng</span>
          </div>
          <div className="social-login">
            <button className="btn-social google">
              <i className="fa-brands fa-google"></i> Google
            </button>
            <button className="btn-social facebook">
              <i className="fa-brands fa-facebook-f"></i> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
