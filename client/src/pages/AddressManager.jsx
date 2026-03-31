import { useState, useEffect } from 'react';
import addressService from '../services/addressService';
import AddressSelector from '../components/AddressSelector';

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    receiver_name: '',
    receiver_phone: '',
    province: '',
    district: '',
    ward: '',
    address_detail: ''
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressService.getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy địa chỉ", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefaultAddress(id);
      fetchAddresses();
    } catch (err) { alert('Không thể đặt mặc định'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      try {
        await addressService.deleteAddress(id);
        setAddresses(addresses.filter(addr => addr._id !== id));
      } catch (err) { alert('Lỗi khi xóa'); }
    }
  };

  const handleAddressChange = (data) => {
    setNewAddress(prev => ({
      ...prev,
      province: data.province,
      district: data.district,
      ward: data.ward,
      address_detail: data.detail
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    if (!phoneRegex.test(newAddress.receiver_phone.trim())) {
      return alert('Số điện thoại người nhận không hợp lệ (phải đúng 10 chữ số)');
    }

    if (!newAddress.province || !newAddress.district || !newAddress.ward) {
      return alert('Vui lòng chọn đầy đủ thông tin địa chỉ');
    }

    try {
      setLoading(true);
      await addressService.createAddress(newAddress);
      setNewAddress({ 
        receiver_name: '', 
        receiver_phone: '', 
        province: '', 
        district: '', 
        ward: '', 
        address_detail: '' 
      });
      setShowAddForm(false);
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi thêm địa chỉ mới");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Địa chỉ của tôi</h5>
        <button 
          className={`btn ${showAddForm ? 'btn-secondary' : 'btn-outline-danger'} btn-sm`}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <i className={`fa-solid ${showAddForm ? 'fa-xmark' : 'fa-plus'} me-1`}></i>
          {showAddForm ? 'Hủy bỏ' : 'Thêm địa chỉ mới'}
        </button>
      </div>

      {showAddForm && (
        <div className="card border-0 bg-light p-3 mb-4 shadow-sm">
          <form onSubmit={handleAddAddress}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Tên người nhận</label>
                <input 
                  type="text" className="form-control form-control-sm" required
                  value={newAddress.receiver_name}
                  onChange={e => setNewAddress({...newAddress, receiver_name: e.target.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Số điện thoại</label>
                <input 
                  type="text" className="form-control form-control-sm" required
                  placeholder="Nhập 10 số..."
                  value={newAddress.receiver_phone}
                  onChange={e => setNewAddress({...newAddress, receiver_phone: e.target.value})}
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold mb-2">Khu vực địa lý</label>
                <AddressSelector onAddressChange={handleAddressChange} />
              </div>

              <div className="col-12 text-end mt-3">
                <button type="submit" className="btn btn-danger btn-sm px-4 fw-bold" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading && !showAddForm ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : (
        <div className="list-group">
          {addresses.map(addr => (
            <div key={addr._id} className="list-group-item border rounded-3 mb-3 p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center mb-1">
                    <span className="fw-bold me-2">{addr.receiver_name}</span>
                    <span className="text-muted small">| {addr.receiver_phone}</span>
                    {addr.is_default && <span className="badge bg-danger ms-2 small">Mặc định</span>}
                  </div>
                  <div className="small text-secondary">{addr.address_detail}</div>
                  <div className="small text-muted">{addr.ward}, {addr.district}, {addr.province}</div>
                </div>
                <div className="text-end">
                  <button onClick={() => handleDelete(addr._id)} className="btn btn-link text-danger p-0 me-3 text-decoration-none small">Xóa</button>
                  {!addr.is_default && (
                    <button onClick={() => handleSetDefault(addr._id)} className="btn btn-link text-dark p-0 text-decoration-none small">Đặt mặc định</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {addresses.length === 0 && !showAddForm && <p className="text-center py-4 text-muted small">Bạn chưa có địa chỉ nào.</p>}
        </div>
      )}
    </div>
  );
}