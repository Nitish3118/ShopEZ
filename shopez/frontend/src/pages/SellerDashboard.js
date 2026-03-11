import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, ShoppingBag, DollarSign, TrendingUp, Plus, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './SellerDashboard.css';

const API = "https://shopez-t95h.onrender.com";

const COLORS = ['#f0b429', '#ff6b35', '#4f8ef7', '#22c55e', '#a14ff7'];

const BLANK_PRODUCT = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  discount: '',
  category: 'Electronics',
  brand: '',
  stock: '',
  images: [''],
  featured: false,
  tags: ''
};

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

    if (!user || user.role !== 'seller') {
      navigate('/');
      return;
    }

    fetchAll();

  }, [user]);

  const fetchAll = async () => {

    try {

      const [a, p, o] = await Promise.all([

        axios.get(`${API}/api/seller/analytics`),
        axios.get(`${API}/api/seller/products`),
        axios.get(`${API}/api/seller/orders`)

      ]);

      setAnalytics(a.data || {});
      setProducts(p.data || []);
      setOrders(o.data || []);

    }
    catch {
      toast.error('Failed to load');
    }
    finally {
      setLoading(false);
    }

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

      tags: form.tags
        ? form.tags.split(',').map(t => t.trim())
        : []

    };

    try {

      if (editProduct) {

        await axios.put(
          `${API}/api/products/${editProduct._id}`,
          payload
        );

        toast.success('Product updated!');

      } else {

        await axios.post(
          `${API}/api/products`,
          payload
        );

        toast.success('Product created!');

      }

      setShowForm(false);
      setEditProduct(null);
      setForm(BLANK_PRODUCT);

      fetchAll();

    }
    catch (err) {

      toast.error(
        err.response?.data?.message || 'Failed'
      );

    }

  };

  const deleteProduct = async (id) => {

    if (!window.confirm('Delete this product?')) return;

    try {

      await axios.delete(
        `${API}/api/products/${id}`
      );

      toast.success('Deleted');

      fetchAll();

    }
    catch {
      toast.error('Delete failed');
    }

  };

  const updateOrderStatus = async (id, status) => {

    try {

      await axios.put(
        `${API}/api/seller/orders/${id}/status`,
        { status }
      );

      toast.success('Status updated');

      fetchAll();

    }
    catch {
      toast.error('Failed');
    }

  };

  const startEdit = (product) => {

    setForm({

      ...product,

      tags: product.tags?.join(', ') || '',

      images:
        product.images?.length
          ? product.images
          : ['']

    });

    setEditProduct(product);

    setShowForm(true);

    setActiveTab('products');

  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );

  return (

    <div className="seller-page container">

      <div className="seller-header">

        <div>

          <h1>Seller Dashboard</h1>

          <p>
            Welcome back, {user?.name}
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => {

            setShowForm(!showForm);

            setEditProduct(null);

            setForm(BLANK_PRODUCT);

            setActiveTab('products');

          }}
        >

          <Plus size={18} /> Add Product

        </button>

      </div>


      {analytics && (

        <div className="stats-grid">

          {[

            {
              label: 'Total Revenue',
              value: `$${(analytics?.totalRevenue || 0).toFixed(2)}`,
              icon: <DollarSign />,
              color: '#f0b429'
            },

            {
              label: 'Total Orders',
              value: analytics?.totalOrders || 0,
              icon: <ShoppingBag />,
              color: '#4f8ef7'
            },

            {
              label: 'Products',
              value: analytics?.totalProducts || 0,
              icon: <Package />,
              color: '#22c55e'
            },

            {
              label: 'Units Sold',
              value: analytics?.totalSales || 0,
              icon: <TrendingUp />,
              color: '#a14ff7'
            }

          ].map((s, i) => (

            <div
              key={i}
              className="stat-card"
              style={{ '--s-color': s.color }}
            >

              <div
                className="stat-icon"
                style={{ color: s.color }}
              >
                {s.icon}
              </div>

              <div>

                <div className="stat-value">
                  {s.value}
                </div>

                <div className="stat-label">
                  {s.label}
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* PRODUCTS TABLE */}

      {products.length === 0 ? (

        <div className="table-empty">
          No products yet
        </div>

      ) : (

        products.map(p => (

          <div
            key={p._id}
            className="table-row"
          >

            <span>
              {p.name}
            </span>

            <span>
              ${ (p?.price || 0).toFixed(2) }
            </span>

            <span>
              {p.stock}
            </span>

            <button
              onClick={() => startEdit(p)}
            >
              <Edit3 size={15} />
            </button>

            <button
              onClick={() => deleteProduct(p._id)}
            >
              <Trash2 size={15} />
            </button>

          </div>

        ))

      )}

      {/* ORDERS */}

      {orders.map(order => (

        <div
          key={order._id}
          className="table-row"
        >

          <span>
            #{order._id.slice(-6)}
          </span>

          <span>
            {order.user?.name || 'Unknown'}
          </span>

          <span>
            ${ (order?.totalAmount || 0).toFixed(2) }
          </span>

          <select
            value={order.orderStatus}
            onChange={e =>
              updateOrderStatus(
                order._id,
                e.target.value
              )
            }
          >

            {[
              'processing',
              'confirmed',
              'shipped',
              'delivered',
              'cancelled'
            ].map(s => (

              <option
                key={s}
                value={s}
              >
                {s}
              </option>

            ))}

          </select>

        </div>

      ))}

    </div>

  );

}