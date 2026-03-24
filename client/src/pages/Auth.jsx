import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Auth() {
  const [state, setState] = useState('login');
  const { user, login: loginToContext } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    passwordConfirm: '',
    full_name: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await loginApi(formData.phone, formData.password);
      
      if (response.success) {
        loginToContext(response.data.user, response.data.token);
        navigate('/');
      }
    } catch (error) {
      alert(error); 
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerApi(formData.full_name, formData.phone, formData.password, formData.passwordConfirm);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setState('login');
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBg}>
        <div className={styles.authBgOverlay}>
          <h1>Food App</h1>
          <p>Đặt món thả ga - Freeship tận nhà</p>
        </div>
      </div>

      <div className={styles.authFormContainer}>
        <div className={styles.authBoxModern}>
          {state === 'login' ? (
            <>
              <h2 className={styles.authTitle}>Đăng nhập</h2>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-phone"></i>
                <input type="text" placeholder="Số điện thoại" id="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-lock"></i>
                <input type="password" placeholder="Mật khẩu" id="password" value={formData.password} onChange={handleInputChange} />
              </div>
              <button className={styles.btnAuth} disabled={loading} onClick={handleLogin}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
              <div className={styles.authFooter}>
                Chưa có tài khoản? <span className={styles.linkHighlight} onClick={() => setState('register')}>Đăng ký ngay</span>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.authTitle}>Tạo tài khoản</h2>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-user"></i>
                <input type="text" placeholder="Họ và tên" id="full_name" value={formData.full_name} onChange={handleInputChange} />
              </div>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-phone"></i>
                <input type="text" placeholder="Số điện thoại" id="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-lock"></i>
                <input type="password" placeholder="Mật khẩu" id="password" value={formData.password} onChange={handleInputChange} />
              </div>
              <div className={styles.inputGroup}>
                <i className="fa-solid fa-lock"></i>
                <input type="password" placeholder="Xác nhận mật khẩu" id="passwordConfirm" value={formData.passwordConfirm} onChange={handleInputChange} />
              </div>
              <button className={styles.btnAuth} disabled={loading} onClick={handleRegister}>
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
              <div className={styles.authFooter}>
                Đã có tài khoản? <span className={styles.linkHighlight} onClick={() => setState('login')}>Đăng nhập</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}