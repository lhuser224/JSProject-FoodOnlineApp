import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/authService';
import AddressManager from './AddressManager';

export default function Profile() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState('info');
  const [loading, setLoading] = useState(false);

  const [infoForm, setInfoForm] = useState({ 
    full_name: user?.full_name || '', 
    phone: user?.phone || '' 
  });
  const [passForm, setPassForm] = useState({ 
    oldPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    if (location.state?.activeTab) {
      setTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (infoForm.full_name.trim().length < 2) return alert('Họ tên quá ngắn');
    try {
      setLoading(true);
      const res = await updateProfile(infoForm);
      if (res.success) {
        alert('Cập nhật thành công!');
        const token = localStorage.getItem('token');
        login(res.data, token);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật');
    } finally { setLoading(false); }
  };

  const handleChangePass = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) return alert('Mật khẩu mới không khớp');
    const passwordRegex = /^(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(passForm.newPassword)) return alert('Mật khẩu tối thiểu 8 ký tự và có chữ cái');

    try {
      setLoading(true);
      await changePassword(passForm.oldPassword, passForm.newPassword);
      alert('Đổi mật khẩu thành công!');
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Mật khẩu cũ không đúng');
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-5 mt-4">
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm overflow-hidden border-start border-4 border-danger">
            <div className="list-group list-group-flush">
              <button 
                onClick={() => setTab('info')} 
                className={`list-group-item list-group-item-action py-3 border-0 fw-bold ${tab === 'info' ? 'active bg-danger text-white' : 'text-dark'}`}
              >
                <i className="fa-solid fa-user-circle me-2"></i> Tài khoản của tôi
              </button>
              <button 
                onClick={() => setTab('address')} 
                className={`list-group-item list-group-item-action py-3 border-0 fw-bold ${tab === 'address' ? 'active bg-danger text-white' : 'text-dark'}`}
              >
                <i className="fa-solid fa-map-marked-alt me-2"></i> Sổ địa chỉ
              </button>
              <button 
                onClick={() => setTab('pass')} 
                className={`list-group-item list-group-item-action py-3 border-0 fw-bold ${tab === 'pass' ? 'active bg-danger text-white' : 'text-dark'}`}
              >
                <i className="fa-solid fa-key me-2"></i> Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card border-0 shadow-sm p-4 min-vh-50 bg-white rounded-3">
            {tab === 'info' && (
              <form onSubmit={handleUpdateInfo}>
                <h4 className="fw-bold mb-4">Cập nhật hồ sơ</h4>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">HỌ VÀ TÊN</label>
                  <input type="text" className="form-control form-control-lg fs-6 shadow-sm" value={infoForm.full_name} onChange={e => setInfoForm({...infoForm, full_name: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">SỐ ĐIỆN THOẠI</label>
                  <input type="text" className="form-control form-control-lg bg-light shadow-none" value={infoForm.phone} disabled />
                </div>
                <button className="btn btn-danger px-5 py-2 fw-bold shadow" disabled={loading}>{loading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}</button>
              </form>
            )}

            {tab === 'address' && (
              <div>
                <h4 className="fw-bold mb-4">Danh sách địa chỉ đã lưu</h4>
                <AddressManager />
              </div>
            )}

            {tab === 'pass' && (
              <form onSubmit={handleChangePass}>
                <h4 className="fw-bold mb-4">Bảo mật tài khoản</h4>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">MẬT KHẨU HIỆN TẠI</label>
                  <input type="password" className="form-control form-control-lg fs-6" value={passForm.oldPassword} onChange={e => setPassForm({...passForm, oldPassword: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">MẬT KHẨU MỚI</label>
                  <input type="password" className="form-control form-control-lg fs-6" value={passForm.newPassword} onChange={e => setPassForm({...passForm, newPassword: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">XÁC NHẬN MẬT KHẨU</label>
                  <input type="password" className="form-control form-control-lg fs-6" value={passForm.confirmPassword} onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})} />
                </div>
                <button className="btn btn-primary px-5 py-2 fw-bold shadow" disabled={loading}>{loading ? 'ĐANG XỬ LÝ...' : 'ĐỔI MẬT KHẨU'}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}