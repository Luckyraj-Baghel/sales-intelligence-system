# SalesIntel — Sales Intelligence Dashboard

> A full-stack Business Intelligence platform that transforms raw sales CSV data into interactive analytics, KPI dashboards, and data-driven insights.

**Live Demo:** [https://sales-intelligence-system.vercel.app](https://sales-intelligence-system.vercel.app)

---

## Features

- **JWT Authentication** — Secure register/login with role-based access (Admin, Business Analyst)
- **KPI Dashboard** — Total revenue, orders, customers, avg order value with date & region filters
- **Revenue Trends** — Month-over-month growth with MoM % change using SQL window functions
- **Product Analytics** — Top products by revenue, units sold, category breakdown
- **Customer Analytics** — Customer segments, lifetime value, regional distribution
- **Sales Team Leaderboard** — Rep rankings by revenue with DENSE_RANK SQL window function
- **CSV Import** — Upload sales data CSV with row-level validation, batch insert, and error reporting
- **Reports & Export** — Download filtered analytics as CSV
- **Protected Routes** — All analytics pages require valid JWT token

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI component framework |
| Vite | 8.x | Build tool (native ESM, instant HMR) |
| React Router DOM | 7.x | Client-side routing |
| Tailwind CSS | 3.x | Utility-first styling |
| Recharts | 3.x | Interactive charts and graphs |
| Axios | 1.x | HTTP client with interceptors |
| Lucide React | Latest | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | LTS | JavaScript runtime |
| Express.js | 5.x | REST API framework |
| jsonwebtoken | Latest | JWT sign and verify |
| bcryptjs | Latest | Password hashing (salt rounds = 10) |
| Multer | Latest | CSV file upload handling |
| csv-parser | Latest | Stream-based CSV row parsing |
| @neondatabase/serverless | 1.x | PostgreSQL driver for Neon |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| PostgreSQL (Neon) | Cloud serverless relational database |
| Vercel | Frontend + backend deployment, global CDN |

---

## Project Structure

`
sales-intelligence-system/
├── client/                        # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state (user, login, logout)
│   │   ├── components/
│   │   │   └── Layout.jsx         # Sidebar, navbar, breadcrumb shell
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # Public landing page
│   │   │   ├── Login.jsx          # Login form
│   │   │   ├── Register.jsx       # Registration form
│   │   │   ├── Dashboard.jsx      # KPI + trends + filters (main page)
│   │   │   ├── ProductAnalytics.jsx
│   │   │   ├── CustomerAnalytics.jsx
│   │   │   ├── SalesTeamAnalytics.jsx
│   │   │   ├── ImportSales.jsx    # CSV file upload page
│   │   │   └── Reports.jsx        # Filterable report + CSV export
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + request interceptor
│   │   ├── App.jsx                # Routes + ProtectedRoute wrapper
│   │   └── main.jsx               # React 19 createRoot entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json                # SPA rewrites for React Router
│
└── server/                        # Express.js backend
    ├── src/
    │   ├── config/
    │   │   └── db.js              # Neon DB pool + query/getClient exports
    │   ├── controllers/
    │   │   ├── authController.js  # register, login handlers
    │   │   ├── analyticsController.js
    │   │   └── importController.js
    │   ├── middleware/
    │   │   └── authMiddleware.js  # JWT verify → req.user
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── analyticsRoutes.js # All routes protected with auth middleware
    │   │   └── importRoutes.js    # Protected + Multer file upload
    │   ├── services/
    │   │   ├── analyticsService.js # Complex SQL: LAG(), DENSE_RANK(), CTEs
    │   │   └── importService.js    # CSV parse → validate → transaction insert
    │   └── app.js                  # Express app: CORS, middleware, routes
    └── package.json
`

---

## Getting Started

### Prerequisites
- Node.js >= 18.x
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- Git

### 1. Clone the repository
`ash
git clone https://github.com/Luckyraj-Baghel/sales-intelligence-system.git
cd sales-intelligence-system
`

### 2. Set up the database
Run the schema SQL on your Neon console to create all tables:
`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'business_analyst',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  region_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(200) NOT NULL,
  category_id INT REFERENCES categories(id),
  unit_price NUMERIC(10,2)
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(200) NOT NULL,
  email VARCHAR(150),
  region_id INT REFERENCES regions(id)
);

CREATE TABLE salespersons (
  id SERIAL PRIMARY KEY,
  salesperson_name VARCHAR(200) NOT NULL,
  region_id INT REFERENCES regions(id)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  salesperson_id INT REFERENCES salespersons(id),
  region_id INT REFERENCES regions(id),
  order_date DATE NOT NULL,
  total_amount NUMERIC(12,2),
  status VARCHAR(20) DEFAULT 'completed'
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2),
  subtotal NUMERIC(12,2),
  total_units_sold INT
);
`

### 3. Install & configure the backend
`ash
cd server
npm install
`

Create server/.env:
`env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_strong_secret_here
`

> **Important:** For local development, use the **Direct** connection string from Neon (without -pooler in hostname). The pooler URL is for serverless/production only.

Start the backend:
`ash
npm run dev
`

### 4. Install & configure the frontend
`ash
cd client
npm install
`

Create client/.env:
`env
VITE_API_BASE_URL=http://localhost:5000
`

Start the frontend:
`ash
npm run dev
`

Open [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create new user account |
| POST | /api/auth/login | No | Login and receive JWT token |
| GET | /api/analytics/dashboard | Yes | KPIs, revenue trends, regional breakdown |
| GET | /api/analytics/products | Yes | Product performance analytics |
| GET | /api/analytics/customers | Yes | Customer segments and lifetime value |
| GET | /api/analytics/sales-team | Yes | Sales rep leaderboard with rankings |
| POST | /api/import/sales | Yes | Upload CSV file for bulk data import |
| GET | /api/health | No | Server health check |

### Authentication
All protected endpoints require:
`
Authorization: Bearer <jwt_token>
`

### Dashboard Query Parameters
`
GET /api/analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31&regionId=1&categoryId=2
`

---

## CSV Import Format

The CSV file for /api/import/sales must have these columns:

`csv
order_date,customer_id,salesperson_id,region_id,product_id,quantity,unit_price,status
2024-03-15,1,2,1,3,5,299.99,completed
`

| Column | Type | Required | Notes |
|---|---|---|---|
| order_date | DATE | Yes | Format: YYYY-MM-DD |
| customer_id | INT | Yes | Must exist in customers table |
| salesperson_id | INT | Yes | Must exist in salespersons table |
| region_id | INT | Yes | Must exist in egions table |
| product_id | INT | Yes | Must exist in products table |
| quantity | INT | Yes | Must be > 0 |
| unit_price | DECIMAL | Yes | Must be > 0 |
| status | VARCHAR | No | Default: completed |

Invalid rows are rejected with reasons — valid rows are inserted atomically in a single transaction.

---

## Environment Variables

### Backend (server/.env)
| Variable | Description | Example |
|---|---|---|
| PORT | Express server port | 5000 |
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host/db?sslmode=require |
| CLIENT_URL | Frontend URL for CORS allowlist | http://localhost:5173 |
| JWT_SECRET | Secret key for signing JWT tokens | your_strong_random_secret |

### Frontend (client/.env)
| Variable | Description | Example |
|---|---|---|
| VITE_API_BASE_URL | Backend API base URL | http://localhost:5000 |

---

## Deployment

This project is deployed on **Vercel**.

### Frontend (Vercel)
1. Import the GitHub repo in Vercel dashboard.
2. Set **Root Directory** to client.
3. Build command: ite build, Output: dist.
4. Add environment variable: VITE_API_BASE_URL=<your_backend_url>.

### Backend (Vercel)
1. Import the same repo, set **Root Directory** to server.
2. Add all .env variables in Vercel → Settings → Environment Variables.
3. Use the **Neon pooler connection string** (-pooler in hostname) for DATABASE_URL in production.
4. Set CLIENT_URL to your Vercel frontend URL.

The client/vercel.json rewrites ensure React Router works correctly on page refresh:
`json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
`

---

## Architecture Overview

`
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Vercel CDN)                   │
│  React 19 + Vite + Tailwind CSS + Recharts               │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │ AuthContext │  │ React Router │  │ Axios +       │   │
│  │ (JWT state) │  │ (7 routes)   │  │ Interceptors  │   │
│  └─────────────┘  └──────────────┘  └───────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS + JWT Bearer Token
                          ▼
┌─────────────────────────────────────────────────────────┐
│               SERVER (Vercel Serverless)                 │
│  Express.js 5 + Node.js                                  │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────┐   │
│  │ CORS Allowlist│  │ authMiddleware│  │   Multer    │   │
│  │ (middleware)  │  │ JWT verify   │  │ CSV Upload  │   │
│  └───────────────┘  └──────────────┘  └─────────────┘   │
│  ┌──────────────────────────────────────────────────┐    │
│  │  analyticsService.js — SQL: LAG(), DENSE_RANK()  │    │
│  │  importService.js    — CSV parse + transaction   │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────┘
                          │ @neondatabase/serverless
                          ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE (Neon — Serverless Postgres)        │
│  users · orders · order_items · products · customers     │
│  salespersons · regions · categories                     │
└─────────────────────────────────────────────────────────┘
`

---

## Security

- Passwords hashed with **bcryptjs** (salt rounds = 10) — plaintext never stored
- All API routes (except /register, /login, /health) protected with **JWT middleware**
- **Parameterized SQL queries** throughout — no SQL injection risk
- **CORS allowlist** — only known frontend origins accepted
- JWT stored in localStorage, sent via Authorization header — not susceptible to CSRF
- Neon DB connection uses sslmode=require — encrypted in transit
- Production uses HTTPS via Vercel (Let's Encrypt)

---

## Scripts

### Backend
`ash
npm run dev       # Start with nodemon (auto-restart on save)
npm start         # Start production server
`

### Frontend
`ash
npm run dev       # Start Vite dev server (HMR)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
`

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

**Luckyraj Baghel**
- GitHub: [@Luckyraj-Baghel](https://github.com/Luckyraj-Baghel)
- Project: [sales-intelligence-system](https://github.com/Luckyraj-Baghel/sales-intelligence-system)
