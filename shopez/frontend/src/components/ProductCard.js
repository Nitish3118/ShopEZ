import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={12} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
  ));

  return (
    <div className="product-card fade-up">
      <Link to={`/products/${product._id}`} className="product-img-link">
        <div className="product-img-wrap">
          <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name} className="product-img" loading="lazy" />
          {product.discount > 0 && (
            <span className="discount-badge">-{product.discount}%</span>
          )}
          {product.featured && <span className="featured-badge">⭐ Featured</span>}
          <div className="product-overlay">
            <button className="wishlist-btn"><Heart size={16} /></button>
          </div>
        </div>
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        {product.brand && <p className="product-brand">{product.brand}</p>}

        <div className="product-rating">
          <span className="stars">{stars}</span>
          <span className="rating-count">({product.numReviews || 0})</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="price-main">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="price-original">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            className="add-cart-btn"
            onClick={(e) => { e.preventDefault(); addToCart(product._id); }}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={16} />
            {product.stock === 0 ? 'Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
