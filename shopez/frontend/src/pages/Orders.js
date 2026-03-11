import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const STATUS_ICONS = {
  processing: <Clock size={16} />,
  confirmed: <CheckCircle size={16} />,
  shipped: <Truck size={16} />,
  delivered: <CheckCircle size={16} />,
  cancelled: <XCircle size={16} />
};

const STATUS_COLORS = {
  processing: 'var(--accent)',
  confirmed: '#4f8ef7',
  shipped: '#a14ff7',
  delivered: 'var(--success)',
  cancelled: 'var(--error)'
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/my');
        setOrders(data);
      } catch { } finally { setLoading(false); }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="orders-page container">
      <h1>My Orders</h1>
      <p className="orders-sub">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>

      {orders.length === 0 ? (
        <div className="no-orders">
          <Package size={48} />
          <h3>No orders yet</h3>
          <p>When you place an order, it will appear here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-num">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="order-status" style={{ color: STATUS_COLORS[order.orderStatus] }}>
                  {STATUS_ICONS[order.orderStatus]}
                  <span>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</span>
                </div>
              </div>

              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="order-preview-item">
                    {item.image && <img src={item.image} alt={item.name} />}
                    <div>
                      <p>{item.name}</p>
                      <span>x{item.quantity} · ${item.price?.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="more-items">+{order.items.length - 3} more</div>
                )}
              </div>

              <div className="order-card-footer">
                {order.trackingNumber && (
                  <span className="tracking">🚚 {order.trackingNumber}</span>
                )}
                <div className="order-total">
                  Total: <strong>${order.totalAmount?.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
