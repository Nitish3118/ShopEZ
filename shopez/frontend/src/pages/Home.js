import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from "lucide-react";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const API_URL = "https://shopez-t95h.onrender.com";

const CATEGORIES = [
  { name: "Electronics", icon: "⚡", color: "#4f8ef7" },
  { name: "Accessories", icon: "👜", color: "#f7a14f" },
  { name: "Sports", icon: "🏃", color: "#4ff7a1" },
  { name: "Furniture", icon: "🪑", color: "#f74f8e" },
  { name: "Home", icon: "🏠", color: "#a14ff7" },
];

const FEATURES = [
  { icon: <Truck size={24} />, title: "Free Shipping", desc: "On all orders over $50" },
  { icon: <Shield size={24} />, title: "Secure Payment", desc: "100% protected transactions" },
  { icon: <RotateCcw size={24} />, title: "Easy Returns", desc: "30-day hassle-free returns" },
  { icon: <Zap size={24} />, title: "Fast Delivery", desc: "Same day for local orders" },
];

export default function Home() {

  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchFeatured = async () => {
      try {

        const res = await axios.get(`${API_URL}/api/products?featured=true&limit=8`);

        const data = res.data;

        // handle all possible response formats
        if (Array.isArray(data)) {
          setFeatured(data);
        } 
        else if (Array.isArray(data.products)) {
          setFeatured(data.products);
        } 
        else {
          setFeatured([]);
        }

      } catch (err) {
        console.error("Products fetch error:", err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();

  }, []);

  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>

        <div className="container hero-content">
          <div className="hero-badge">
            <span>✨</span> New Season, New Deals
          </div>

          <h1 className="hero-title">
            Shop Smarter,<br />
            <span className="hero-accent">Live Better</span>
          </h1>

          <p className="hero-desc">
            Discover thousands of products curated for your lifestyle.
            Unbeatable prices, fast delivery, and a seamless shopping experience.
          </p>

          <div className="hero-cta">
            <Link to="/products" className="btn btn-primary btn-lg">
              Explore Now <ArrowRight size={18} />
            </Link>

            <Link to="/products?featured=true" className="btn btn-ghost btn-lg">
              Featured Picks
            </Link>
          </div>
        </div>
      </section>


      {/* Features */}
      <section className="features">
        <div className="container features-grid">

          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </section>


      {/* Categories */}
      <section className="section container">

        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>

          <Link to="/products" className="btn btn-outline btn-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="categories-grid">

          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              to={`/products?category=${cat.name}`}
              className="category-card"
              style={{ "--cat-color": cat.color }}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
              <ArrowRight size={16} className="cat-arrow" />
            </Link>
          ))}

        </div>
      </section>


      {/* Featured Products */}
      <section className="section container">

        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked just for you</p>
          </div>

          <Link to="/products?featured=true" className="btn btn-outline btn-sm">
            See All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
          </div>
        ) : (
          <div className="product-grid">

            {featured.length > 0 ? (
              featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))
            ) : (
              <p>No featured products found.</p>
            )}

          </div>
        )}

      </section>

    </div>
  );
}