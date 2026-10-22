<<<<<<< HEAD
# CraftNest — Handmade with Heart

> A complete, full-stack, responsive e-commerce marketplace for handmade, artisanal, and homemade craft products connecting independent makers across India with conscious patrons.

![CraftNest Banner](client/public/assets/hero-artisan.jpg)

---

## 🌿 Brand Identity & Design System

- **Brand Name:** CraftNest
- **Tagline:** Handmade with Heart
- **Emblem:** Woven artisan twigs, leaves, and central heart mark with warm serif typography.
- **Color Palette:**
  - **Warm Cream:** `#F7F1DF`
  - **Forest Green:** `#354B36`
  - **Terracotta:** `#A96548`
  - **Soft Beige:** `#E8DDC6`
  - **White:** `#FFFFFF`
  - **Dark Text:** `#292D29`
- **Typography:**
  - Headings: Serif elegance via *Playfair Display* & *Cormorant Garamond*
  - Body Text: Clean modern sans-serif via *Plus Jakarta Sans*

---

## 🛠 Technology Stack

### Frontend (`/client`)
- **React.js 18+** with Functional Components and custom hooks
- **React Router DOM 7+** for client-side routing & protected layouts
- **Vite** build tooling with rapid HMR and proxy support
- **Context API** for Authentication, Shopping Basket, Wishlist, and Toast notifications
- **Plain / Vanilla CSS** tokens and modular classes (zero utility overhead)
- **Lucide React** for interface iconography
- **Axios** with request interceptors for JWT Bearer tokens and unified 401 handling

### Backend (`/server`)
- **Node.js & Express.js** RESTful API with `/api/v1` base route
- **MongoDB & Mongoose 8+** with compound indexes, schemas, and virtuals
- **JWT (JSON Web Tokens)** for stateless, secure session authorization
- **bcryptjs** for salted password hashing (rounds = 10)
- **Multer** for local disk image uploads with MIME type and 5MB validation
- **Helmet, CORS, and Express-Rate-Limit** for server hardening
- **Atomic MongoDB Operations** (`$inc`, `$gte`) to prevent overselling and race conditions

---

## 🚀 Key Features by Role

### 1. Buyer Experience
- **Artisan Home Page:** Hero section, popular categories, featured handmade treasures, meet-the-makers spotlight, gift recommendations, and verified customer testimonials.
- **Shop & Discovery:** Real-time search, category filtering (Candles, Pottery, Crochet, Art, Hampers, etc.), min/max price filtering, sorting (price, popularity, rating, newest), and pagination.
- **Product Details:** High-resolution image gallery, artisan shop attribution, materials, dimensions, processing time, verified reviews, and related products.
- **Basket & Checkout:** Server-recalculated subtotals, free shipping progress bar, delivery address form, and test payment options (Instant Test Card, UPI Simulation, Cash on Delivery).
- **Buyer Dashboard:** Order history with visual status progression stepper (`Pending` → `Confirmed` → `Processing` → `Shipped` → `Delivered`), order cancellation with automatic stock restoration, verified product reviews, and wishlist.

### 2. Seller Studio
- **Overview Dashboard:** Total listed creations, pending orders, completed orders, gross sales, net artisan earnings (90%), platform fee (10%), low-stock alerts, and 7-day sales trend chart.
- **Product Management:** Full CRUD product studio with image upload, stock management, custom processing time, and customization options.
- **Order Fulfillment:** Item-level order fulfillment status transitions (`Confirmed`, `Processing`, `Shipped`, `Delivered`).
- **Storefront Profile:** Customize maker bio, location, craft speciality, logo, and banner.

### 3. Administrator Console
- **Marketplace Metrics:** Total GMV, platform commission, registered users, and active sellers.
- **Seller Verification:** Approve, suspend, or reinstate artisan accounts.
- **User Directory:** Filter members by role and toggle account status.
- **Orders Monitoring:** Global view of all marketplace transactions and financial fee splits.
- **Commission Configuration:** Dynamically configure platform fee percentage.

---

## 👥 Seeded Demonstration Accounts

The database comes pre-seeded with realistic artisanal products, active shops, and demo accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@craftnest.in` | `Admin@123` | Platform Super Administrator |
| **Seller** | `aarohi@craftnest.in` | `Seller@123` | *Aarohi Botanicals & Candles* (Jaipur) |
| **Seller** | `kavya@craftnest.in` | `Seller@123` | *Kavya Knotwork & Crochet* (Ahmedabad) |
| **Seller** | `dhruv@craftnest.in` | `Seller@123` | *Mitti & Clay Studio* (Pune) |
| **Buyer** | `priya@example.com` | `Buyer@123` | Regular buyer with delivered orders |
| **Buyer** | `rahul@example.com` | `Buyer@123` | Regular buyer with active order |

> **Tip:** The Login page includes one-click demo buttons to switch between Buyer, Seller, and Admin roles instantly.

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local service on port 27017 or MongoDB Atlas URI)

### 1. Clone & Enter Project Directory
```bash
cd e:/ED
```

### 2. Configure Server Environment
The `.env` file is located in `/server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/craftnest
JWT_SECRET=craftnest_super_secret_jwt_key_handmade_with_heart_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
PLATFORM_COMMISSION_PERCENT=10
```

### 3. Seed Database with Artisanal Creations
```bash
cd server
npm run seed
```

### 4. Start the Express Backend
```bash
cd server
npm start
# Server listens on http://localhost:5000
```

### 5. Start the React Frontend
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🧪 Automated Testing & Quality Assurance

To verify all business rules, security models, stock protection, and role permissions, run the backend test suite:

```bash
cd server
node scripts/test-api.js
```

### Test Suite Validations:
1. API Health Check (`GET /api/v1/health`)
2. Buyer JWT Authentication & Profile check
3. Seller Studio Authentication & Shop association
4. Admin Authentication
5. Public Product Catalogue & Category filtering
6. Basket item addition & dynamic subtotal recalculation
7. Atomic order placement with server stock protection & race-condition check
8. Verification of decremented inventory
9. Seller dashboard sales calculations and gross vs net fee split
10. Admin role authorization guard (returns 403 for unauthorized users)

---

## 📂 Project Structure

```text
ED/
├── client/                     # React Frontend
│   ├── public/
│   │   ├── assets/
│   │   │   ├── craftnest-logo.svg
│   │   │   └── hero-artisan.jpg
│   │   └── index.html
│   ├── src/
│   │   ├── api/client.js       # Axios instance with interceptors
│   │   ├── components/common/  # Navbar, Footer, ProductCard, ProtectedRoute
│   │   ├── context/            # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── layouts/            # SellerLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── buyer/          # Home, Shop, ProductDetails, Cart, Checkout, Orders, Wishlist, Profile
│   │   │   ├── seller/         # Overview, Products, Orders, Shop, Analytics
│   │   │   ├── admin/          # Overview, Sellers, Users, Orders, Reports
│   │   │   └── info/           # About, Become a Seller, Policies, Contact
│   │   ├── index.css           # Design tokens, typography & CSS variables
│   │   ├── App.jsx             # Master route manifest
│   │   └── main.jsx
│   └── package.json
├── server/                     # Express REST API Backend
│   ├── config/db.js            # MongoDB Mongoose connection
│   ├── controllers/            # Auth, Products, Cart, Orders, Reviews, Seller, Admin
│   ├── middleware/             # Auth (JWT & RBAC), Upload (Multer), ErrorHandler
│   ├── models/                 # User, SellerProfile, Product, Cart, Order, Review, Wishlist, PlatformSetting
│   ├── routes/                 # Versioned /api/v1 routes
│   ├── scripts/
│   │   ├── seed.js             # Database seeder with realistic handmade data
│   │   └── test-api.js         # Automated end-to-end business rule test runner
│   ├── app.js                  # Express application setup & middleware
│   ├── server.js               # Server entry point
│   ├── .env                    # Environment variables
│   └── package.json
├── .gitignore
├── package.json                # Root convenience scripts
└── README.md
```

---

## 🛡 Security & Concurrency Notes

- **Password Safety:** All passwords hashed via `bcryptjs` with salt rounds.
- **Atomic Stock Protection:** Checkouts utilize MongoDB's `$inc` and `$gte` atomic conditional queries to prevent overselling under high concurrency.
- **Server Recalculation:** Product prices, shipping fees, and commission totals are always retrieved directly from database records at checkout time rather than relying on client input.
- **Role Enforcement:** All admin and seller operations are strictly guarded on the backend using the `authenticate` and `authorize('seller', 'admin')` middleware.
=======
# CraftNest
ED Project
>>>>>>> ae5a02a002e70799104a6febd83cf8d679e73ca5
