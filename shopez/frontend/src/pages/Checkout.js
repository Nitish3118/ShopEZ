import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { cart, cartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [form, setForm] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'US',
    cardName: '',
    cardNum: '4242 4242 4242 4242',
    expiry: '12/26',
    cvv: '123'
  });

  const items = cart?.items || [];
  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.zip) return toast.error('Please fill in all shipping details');
    if (!user) return navigate('/login');

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0],
        price: item.product.price,
        quantity: item.quantity
      }));

      const { data } = await axios.post('/api/orders', {
        items: orderItems,
        shippingAddress: { street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country },
        paymentMethod: 'Card',
        subtotal: cartTotal,
        shippingCost: shipping,
        tax,
        totalAmount: total
      });

      setOrderId(data._id);
      setSuccess(true);
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-success container">
        <div className="success-icon"><CheckCircle size={64} /></div>
        <h1>Order Placed! 🎉</h1>
        <p>Your order has been confirmed and will be shipped soon.</p>
        <div className="order-id">Order ID: <span>#{orderId?.slice(-8).toUpperCase()}</span></div>
        <div className="success-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>Track Order</button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h1 className="checkout-title">Checkout</h1>

      <form onSubmit={handleSubmit} className="checkout-layout">
        <div className="checkout-form">
          <div className="form-section">
            <h3>📦 Shipping Address</h3>
            <div className="form-grid">
              <div className="form-group full">
                <label>Street Address</label>
                <input className="input" name="street" value={form.street} onChange={handleChange} placeholder="123 Main St" required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input className="input" name="city" value={form.city} onChange={handleChange} placeholder="New York" required />
              </div>
              <div className="form-group">
                <label>State</label>
                <input className="input" name="state" value={form.state} onChange={handleChange} placeholder="NY" />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input className="input" name="zip" value={form.zip} onChange={handleChange} placeholder="10001" required />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input className="input" name="country" value={form.country} onChange={handleChange} placeholder="US" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><CreditCard size={18} /> Payment Details</h3>
            <p className="demo-note">🔒 Demo mode — use any values below</p>
            <div className="form-grid">
              <div className="form-group full">
                <label>Cardholder Name</label>
                <input className="input" name="cardName" value={form.cardName} onChange={handleChange} placeholder="John Doe" />
              </div>
              <div className="form-group full">
                <label>Card Number</label>
                <input className="input" name="cardNum" value={form.cardNum} onChange={handleChange} placeholder="4242 4242 4242 4242" />
              </div>
              <div className="form-group">
                <label>Expiry</label>
                <input className="input" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input className="input" name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" />
              </div>
            </div>
          </div>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {items.map(item => (
              <div key={item.product?._id} className="order-item">
                <img src={item.product?.images?.[0]} alt={item.product?.name} className="order-item-img" />
                <div className="order-item-info">
                  <p>{item.product?.name}</p>
                  <span>x{item.quantity}</span>
                </div>
                <div className="order-item-price">${(item.product?.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div className="total-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="total-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="total-divider" />
            <div className="total-row grand"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
}
