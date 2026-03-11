import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, ShoppingBag, DollarSign, TrendingUp, Plus, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './SellerDashboard.css';

const COLORS = ['#f0b429', '#ff6b35', '#4f8ef7', '#22c55e', '#a14ff7'];

const BLANK_PRODUCT = { name: '', description: '', price: '', originalPrice: '', discount: '', category: 'Electronics', brand: '', stock: '', images: [''], featured: false, tags: '' };

export default function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(BLANK_PRODUCT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'seller') { navigate('/'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      const [a, p, o] = await Promise.all([
        axios.get('/api/seller/analytics'),
        axios.get('/api/seller/products'),
        axios.get('/api/seller/orders')
      ]);
      setAnalytics(a.data);
      setProducts(p.data);
      setOrders(o.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || undefined,
      discount: Number(form.discount) || 0,
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : []
    };
    try {
      if (editProduct) {
        await axios.put(`/api/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await axios.post('/api/products', payload);
        toast.success('Product created!');
      }
      setShowForm(false); setEditProduct(null); setForm(BLANK_PRODUCT);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Deleted');
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`/api/seller/orders/${id}/status`, { status });
      toast.success('Status updated');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  const startEdit = (product) => {
    setForm({ ...product, tags: product.tags?.join(', ') || '', images: product.images?.length ? product.images : [''] });
    setEditProduct(product);
    setShowForm(true);
    setActiveTab('products');
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="seller-page container">
      <div className="seller-header">
        <div>
          <h1>Seller Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm(BLANK_PRODUCT); setActiveTab('products'); }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Stats */}
      {analytics && (
        <div className="stats-grid">
          {[
            { label: 'Total Revenue', value: `$${analytics.totalRevenue.toFixed(2)}`, icon: <DollarSign />, color: '#f0b429' },
            { label: 'Total Orders', value: analytics.totalOrders, icon: <ShoppingBag />, color: '#4f8ef7' },
            { label: 'Products', value: analytics.totalProducts, icon: <Package />, color: '#22c55e' },
            { label: 'Units Sold', value: analytics.totalSales, icon: <TrendingUp />, color: '#a14ff7' }
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ '--s-color': s.color }}>
              <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Nav */}
      <div className="dash-tabs">
        {['analytics', 'products', 'orders'].map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="analytics-grid">
          <div className="chart-card">
            <h3>Monthly Revenue</h3>
            {analytics.monthlySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics.monthlySales}>
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ background: '#161616', border: '1px solid #333', borderRadius: 8, color: '#f5f5f5' }} />
                  <Bar dataKey="revenue" fill="#f0b429" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="no-data">No sales data yet</p>}
          </div>

          <div className="chart-card">
            <h3>Products by Category</h3>
            {analytics.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={analytics.categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="count" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {analytics.categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#161616', border: '1px solid #333', borderRadius: 8, color: '#f5f5f5' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="no-data">No products yet</p>}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {showForm && (
            <div className="product-form-card">
              <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleSubmit} className="product-form">
                <div className="pf-grid">
                  <div className="form-group full">
                    <label>Product Name *</label>
                    <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className="form-group full">
                    <label>Description *</label>
                    <textarea className="input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label>Price *</label>
                    <input className="input" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Original Price</label>
                    <input className="input" type="number" step="0.01" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Discount %</label>
                    <input className="input" type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input className="input" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {['Electronics', 'Accessories', 'Sports', 'Furniture', 'Home', 'Clothing', 'Books', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Brand</label>
                    <input className="input" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
                  </div>
                  <div className="form-group full">
                    <label>Image URL</label>
                    <input className="input" value={form.images[0]} onChange={e => setForm(f => ({ ...f, images: [e.target.value] }))} placeholder="https://..." />
                  </div>
                  <div className="form-group full">
                    <label>Tags (comma-separated)</label>
                    <input className="input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="tag1, tag2" />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                      Featured Product
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editProduct ? 'Update' : 'Create'} Product</button>
                  <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditProduct(null); setForm(BLANK_PRODUCT); }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="products-table">
            <div className="table-header">
              <span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span>
            </div>
            {products.length === 0 ? (
              <div className="table-empty">No products yet. Add your first product above!</div>
            ) : products.map(p => (
              <div key={p._id} className="table-row">
                <div className="table-product">
                  <img src={p.images?.[0]} alt={p.name} />
                  <div>
                    <strong>{p.name}</strong>
                    {p.featured && <span className="feat-tag">Featured</span>}
                  </div>
                </div>
                <span className="table-cat">{p.category}</span>
                <span className="table-price">${p.price.toFixed(2)}</span>
                <span className={`table-stock ${p.stock < 5 ? 'low' : ''}`}>{p.stock}</span>
                <div className="table-actions">
                  <button className="action-btn" onClick={() => startEdit(p)}><Edit3 size={15} /></button>
                  <button className="action-btn danger" onClick={() => deleteProduct(p._id)}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span><span>Customer</span><span>Items</span><span>Total</span><span>Status</span>
          </div>
          {orders.length === 0 ? (
            <div className="table-empty">No orders yet.</div>
          ) : orders.map(order => (
            <div key={order._id} className="table-row">
              <span className="order-id-cell">#{order._id.slice(-6).toUpperCase()}</span>
              <span>{order.user?.name || 'Unknown'}</span>
              <span>{order.items.length} items</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${order.totalAmount?.toFixed(2)}</span>
              <select
                className="status-select"
                value={order.orderStatus}
                onChange={e => updateOrderStatus(order._id, e.target.value)}
              >
                {['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
