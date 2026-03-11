import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, ChevronLeft, Package, Shield, Truck, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const submitReview = async () => {
    if (!user) return toast.error('Login to review');
    try {
      await axios.post(`/api/products/${id}/reviews`, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted!');
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setReviewText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!product) return <div className="loading-screen"><p>Product not found</p></div>;

  const stars = (n) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={14} fill={i < Math.round(n) ? 'currentColor' : 'none'} />
  ));

  return (
    <div className="product-detail container">
      <Link to="/products" className="back-link">
        <ChevronLeft size={18} /> Back to Shop
      </Link>

      <div className="detail-grid">
        {/* Image Gallery */}
        <div className="detail-images">
          <div className="main-image">
            <img src={product.images?.[activeImg] || product.images?.[0]} alt={product.name} />
            {product.discount > 0 && (
              <div className="detail-discount">-{product.discount}% OFF</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="thumb-row">
              {product.images.map((img, i) => (
                <button key={i} className={`thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          {product.brand && <p className="detail-brand">by {product.brand}</p>}

          <div className="detail-rating">
            <span className="stars">{stars(product.rating)}</span>
            <span className="rating-val">{product.rating.toFixed(1)}</span>
            <span className="review-count">({product.numReviews} reviews)</span>
          </div>

          <div className="detail-price">
            <span className="price-big">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="price-orig">${product.originalPrice.toFixed(2)}</span>
                <span className="price-save">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
              </>
            )}
          </div>

          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-stock">✕ Out of Stock</span>
            )}
          </div>

          <div className="qty-row">
            <span>Quantity:</span>
            <div className="qty-controls">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}><Minus size={16} /></button>
              <span className="qty-num">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}><Plus size={16} /></button>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              onClick={() => { for (let i = 0; i < qty; i++) addToCart(product._id); }}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="detail-perks">
            <div className="perk"><Truck size={16} /><span>Free shipping on orders over $50</span></div>
            <div className="perk"><Shield size={16} /><span>Secure, encrypted checkout</span></div>
            <div className="perk"><Package size={16} /><span>30-day hassle-free returns</span></div>
          </div>

          {product.tags?.length > 0 && (
            <div className="detail-tags">
              {product.tags.map((tag, i) => <span key={i} className="tag">#{tag}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <div className="tab-nav">
          {['description', 'reviews'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'reviews' && ` (${product.numReviews})`}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tab === 'description' && (
            <div className="desc-content">
              <p>{product.description}</p>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="reviews-content">
              {product.reviews?.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first!</p>
              ) : (
                <div className="reviews-list">
                  {product.reviews.map((r, i) => (
                    <div key={i} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-avatar">{r.name?.[0]?.toUpperCase()}</div>
                        <div>
                          <strong>{r.name}</strong>
                          <div className="stars" style={{ fontSize: 12 }}>{stars(r.rating)}</div>
                        </div>
                        <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {user && (
                <div className="add-review">
                  <h4>Write a Review</h4>
                  <div className="review-stars-pick">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} className={`star-pick ${n <= reviewRating ? 'active' : ''}`} onClick={() => setReviewRating(n)}>
                        <Star size={20} fill={n <= reviewRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <textarea className="input review-textarea" placeholder="Share your experience..." value={reviewText} onChange={e => setReviewText(e.target.value)} rows={4} />
                  <button className="btn btn-primary" onClick={submitReview}>Submit Review</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
