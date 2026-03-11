# ⚡ ShopEZ — Full-Stack E-Commerce Platform

A complete MERN stack e-commerce application with buyer and seller experiences, real-time cart, order management, and seller analytics dashboard.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| Styling | Custom CSS (Design System) |
| Fonts | Syne + DM Sans (Google Fonts) |

---

## 📁 Project Structure

```
shopez/
├── backend/
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/           # Express API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   └── seller.js
│   ├── middleware/
│   │   └── auth.js       # JWT middleware
│   ├── seedData.js        # Sample data seeder
│   └── server.js
│
└── frontend/
    └── src/
        ├── context/       # React Context
        │   ├── AuthContext.js
        │   └── CartContext.js
        ├── components/    # Shared components
        │   ├── Navbar.js
        │   └── Footer.js
        └── pages/         # Route pages
            ├── Home.js
            ├── Products.js
            ├── ProductDetail.js
            ├── Cart.js
            ├── Checkout.js
            ├── Login.js
            ├── Register.js
            ├── Profile.js
            ├── Orders.js
            └── SellerDashboard.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd shopez/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

For MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shopez
```

### 3. Start Development Servers

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

The app will auto-seed sample data on first run!

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🛒 Buyer | buyer@shopez.com | buyer123 |
| 📦 Seller | seller@shopez.com | seller123 |

Or use the **Demo Login** buttons on the Login page.

---

## ✨ Features

### 🛒 Buyer Features
- Browse & search 12+ seeded products
- Filter by category, price range, sort order
- Product detail with image gallery & reviews
- Add to cart & adjust quantities
- Secure checkout flow
- Order history & tracking

### 📦 Seller Features
- **Analytics Dashboard** with revenue charts & category breakdown
- Product CRUD (Create, Read, Update, Delete)
- Order management with status updates
- Sales metrics overview

### 🔐 Auth & Security
- JWT-based authentication
- bcrypt password hashing
- Protected routes for seller/buyer
- Persistent sessions with localStorage

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile (auth) |
| PUT | `/api/auth/profile` | Update profile (auth) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List with filters |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create (seller) |
| PUT | `/api/products/:id` | Update (seller) |
| DELETE | `/api/products/:id` | Delete (seller) |
| POST | `/api/products/:id/reviews` | Add review (auth) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart/add` | Add item |
| PUT | `/api/cart/update` | Update qty |
| DELETE | `/api/cart/remove/:id` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my` | My orders |
| GET | `/api/orders/:id` | Order detail |

### Seller
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seller/analytics` | Dashboard stats |
| GET | `/api/seller/products` | My products |
| GET | `/api/seller/orders` | My orders |
| PUT | `/api/seller/orders/:id/status` | Update status |

---

## 🎨 Design System

The app uses a custom dark design system with CSS variables:

```css
--accent: #f0b429          /* Golden yellow */
--gradient: linear-gradient(135deg, #f0b429, #ff6b35)
--font-display: 'Syne'     /* Headlines */
--font-body: 'DM Sans'     /* Body text */
```

---

## 📦 Production Build

```bash
cd frontend
npm run build
```

Serve the `build` folder with your backend or a static host (Netlify, Vercel).

For full-stack deployment, you can:
1. Deploy backend to **Railway** or **Render**
2. Deploy frontend to **Vercel** or **Netlify**
3. Use **MongoDB Atlas** for the database
