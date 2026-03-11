import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const items = cart?.items || [];

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="cart-empty container">
        <div className="empty-icon"><ShoppingBag size={64} /></div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet!</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="cart-title">Shopping Cart <span className="cart-badge">{items.length} items</span></h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={product._id} className="cart-item">
                <Link to={`/products/${product._id}`} className="cart-item-img">
                  <img src={product.images?.[0]} alt={product.name} />
                </Link>
                <div className="cart-item-info">
                  <span className="cart-item-cat">{product.category}</span>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="cart-item-name">{product.name}</h3>
                  </Link>
                  <p className="cart-item-brand">{product.brand}</p>
                  <div className="cart-item-price">${product.price.toFixed(2)}</div>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <Minus size={14} />
                    </button>
                    <span className="qty-num">{item.quantity}</span>
                    <button onClick={() => updateQuantity(product._id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="cart-item-subtotal">${(product.price * item.quantity).toFixed(2)}</div>
                  <button className="remove-btn" onClick={() => removeFromCart(product._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-ship">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="ship-notice">Add ${(50 - cartTotal).toFixed(2)} more for free shipping</p>
            )}
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
            Proceed to Checkout <ArrowRight size={18} />
          </Link>

          <Link to="/products" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
