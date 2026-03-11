import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, address: { street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country } };
      if (form.password) payload.password = form.password;
      const { data } = await axios.put('/api/auth/profile', payload);
      login({ ...user, ...data });
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <div className="profile-avatar">{user.name[0].toUpperCase()}</div>
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <span className={`role-badge ${user.role}`}>{user.role}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-section">
          <h3>Personal Info</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input className="input" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input" name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>New Password (optional)</label>
              <input className="input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Shipping Address</h3>
          <div className="profile-grid">
            <div className="form-group full">
              <label>Street</label>
              <input className="input" name="street" value={form.street} onChange={handleChange} placeholder="123 Main St" />
            </div>
            <div className="form-group">
              <label>City</label>
              <input className="input" name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input className="input" name="state" value={form.state} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>ZIP</label>
              <input className="input" name="zip" value={form.zip} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input className="input" name="country" value={form.country} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}
