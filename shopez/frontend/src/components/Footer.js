import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span>⚡</span>
            <span>ShopEZ</span>
          </div>
          <p>Your one-stop destination for effortless online shopping. Discover, shop, and enjoy.</p>
          <div className="footer-social">
            {['𝕏', '📘', '📸', '▶'].map((icon, i) => (
              <button key={i} className="social-btn">{icon}</button>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?featured=true">Featured</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Accessories">Accessories</Link>
          <Link to="/products?category=Sports">Sports</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/seller">Sell on ShopEZ</Link>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Contact Us</a>
          <a href="#">Returns</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 ShopEZ. All rights reserved. Made with ⚡ for effortless shopping.</p>
          <div className="payment-icons">
            {['💳', '🏦', '📱', '💰'].map((icon, i) => (
              <span key={i} className="payment-icon">{icon}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
