import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Sports', 'Furniture', 'Home'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Local UI-only state (not in URL)
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  // Read category/search/featured directly from URL — single source of truth
  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';

  // Reset page whenever URL params change
  useEffect(() => { setPage(1); }, [category, search, featured]);

  // Fetch products whenever any filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.set('category', category);
        if (search) params.set('search', search);
        if (sort) params.set('sort', sort);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (featured) params.set('featured', featured);
        params.set('page', page);
        params.set('limit', 12);

        const { data } = await axios.get(`/api/products?${params}`);
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, featured, sort, minPrice, maxPrice, page]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') next.delete('category');
    else next.set('category', cat);
    next.delete('featured');
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearchParams({});
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const title = featured
    ? '⭐ Featured Products'
    : search
    ? `Results for "${search}"`
    : category === 'All' ? 'All Products' : category;

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <h1>{title}</h1>
          <p>{total} items found</p>
        </div>
      </div>

      <div className="container products-layout">
        {/* Sidebar */}
        <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3><Filter size={18} /> Filters</h3>
            <button className="close-filters" onClick={() => setFiltersOpen(false)}><X size={18} /></button>
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            <div className="filter-options">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-option ${category === cat ? 'active' : ''}`}
                  onClick={() => { setCategory(cat); setFiltersOpen(false); }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                className="input"
                placeholder="Min"
                value={minPrice}
                onChange={e => { setMinPrice(e.target.value); setPage(1); }}
              />
              <span>—</span>
              <input
                type="number"
                className="input"
                placeholder="Max"
                value={maxPrice}
                onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <button className="btn btn-outline" style={{ width: '100%' }} onClick={resetFilters}>
            Reset Filters
          </button>
        </aside>

        <div className="products-main">
          <div className="products-toolbar">
            <button className="btn btn-ghost btn-sm filter-toggle" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="sort-select-wrap">
              <span>Sort by:</span>
              <select
                className="sort-select"
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1); }}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="btn btn-outline" onClick={resetFilters} style={{ marginTop: 12 }}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`page-btn ${page === p ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
