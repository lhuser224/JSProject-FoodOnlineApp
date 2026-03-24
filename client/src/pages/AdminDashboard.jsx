import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function AdminDashboard() {
  const [tab, setTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'categories' ? '/FoodO/categories' : '/FoodO/pending-shops';
      const res = await axiosClient.get(endpoint);
      if (tab === 'categories') setCategories(res.data || []);
      else setSellers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    if (e) e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await axiosClient.post('/FoodO/categories', { name: newCat });
      setNewCat('');
      fetchData();
    } catch (err) {
      alert(err);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editName.trim()) return;
    try {
      await axiosClient.put(`/FoodO/categories/${id}`, { name: editName });
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert(err);
    }
  };

  const handleToggleCategory = async (id, currentStatus) => {
    try {
      await axiosClient.patch(`/FoodO/categories/${id}/toggle`, { is_active: currentStatus });
      fetchData();
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await axiosClient.delete(`/FoodO/categories/${id}`);
      fetchData();
    } catch (err) {
      alert(err);
    }
  };

  const handleApproveShop = async (id) => {
    try {
      await axiosClient.patch(`/FoodO/approve-shop/${id}`);
      fetchData();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="container-fluid p-0 text-dark">
      <div className="row g-0">
        <div className="col-md-2 bg-dark min-vh-100 shadow">
          <div className="p-4 text-white text-center border-bottom border-secondary fw-bold">FOOD O ADMIN</div>
          <div className="list-group list-group-flush mt-2">
            <button className={`list-group-item list-group-item-action bg-dark text-white border-0 py-3 ${tab === 'categories' ? 'active bg-primary' : ''}`} onClick={() => setTab('categories')}>Categories</button>
            <button className={`list-group-item list-group-item-action bg-dark text-white border-0 py-3 ${tab === 'sellers' ? 'active bg-primary' : ''}`} onClick={() => setTab('sellers')}>Pending Sellers</button>
          </div>
        </div>
        <div className="col-md-10 bg-light p-5">
          {tab === 'categories' ? (
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-4">Categories</h4>
              <form className="input-group mb-4 w-50" onSubmit={handleAddCategory}>
                <input type="text" className="form-control" placeholder="New category..." value={newCat} onChange={(e) => setNewCat(e.target.value)} />
                <button className="btn btn-primary px-4" type="submit">Add</button>
              </form>
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th className="text-center">Visibility</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td>
                        {editingId === cat.id ? (
                          <div className="input-group input-group-sm">
                            <input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            <button className="btn btn-success" onClick={() => handleUpdateCategory(cat.id)}>OK</button>
                          </div>
                        ) : (
                          <span className="fw-bold">{cat.name}</span>
                        )}
                      </td>
                      <td><span className={`badge ${cat.is_active ? 'bg-success' : 'bg-secondary'}`}>{cat.is_active ? 'Active' : 'Hidden'}</span></td>
                      <td className="text-center">
                        <div className="form-check form-switch d-inline-block">
                          <input className="form-check-input" type="checkbox" checked={cat.is_active} onChange={() => handleToggleCategory(cat.id, cat.is_active)} />
                        </div>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategory(cat.id)}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-4">Pending Sellers</h4>
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Shop</th>
                    <th>Owner</th>
                    <th>Phone</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map(s => (
                    <tr key={s.id}>
                      <td className="fw-bold text-primary">{s.shop_name}</td>
                      <td>{s.full_name}</td>
                      <td>{s.phone}</td>
                      <td className="text-center">
                        <button className="btn btn-success btn-sm px-4" onClick={() => handleApproveShop(s.id)}>Approve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}