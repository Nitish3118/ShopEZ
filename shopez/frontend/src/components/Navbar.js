import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">ShopEZ</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Shop</Link>
          <Link to="/products?featured=true">Featured</Link>
        </div>

        <form className="nav-search" onSubmit={handleSearch}>
          <Search size={16} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="nav-search-input"
          />
        </form>

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setUserOpen(!userOpen)}>
                <div className="user-avatar">{user.name[0].toUpperCase()}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </button>
              {userOpen && (
                <div className="dropdown">
                  <Link to="/profile"><User size={15} /> Profile</Link>
                  <Link to="/orders"><Package size={15} /> My Orders</Link>
                  {user.role === 'seller' && <Link to="/seller"><LayoutDashboard size={15} /> Dashboard</Link>}
                  <button onClick={handleLogout}><LogOut size={15} /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="mobile-search">
            <Search size={16} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="input" />
          </form>
          <Link to="/">Home</Link>
          <Link to="/products">Shop All</Link>
          <Link to="/products?featured=true">Featured</Link>
          <Link to="/cart">Cart ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/orders">My Orders</Link>
              {user.role === 'seller' && <Link to="/seller">Seller Dashboard</Link>}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
