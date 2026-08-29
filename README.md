# Executive Data Analytics & Business Intelligence Dashboard

A full-stack, production-grade business intelligence dashboard delivering real-time financial metrics, time-series trends, category margin breakdowns, regional territory insights, filtered CSV data export, printable executive reporting, and server-side audit search.

---

## Key Features & Phase Breakdown

### Phase 1: Core Analytics Engine & UI Foundation
- **Data Layer & Schema**: MongoDB database with Mongoose `Transaction` schema covering revenue, cost, margin, category, region, and status.
- **RESTful Analytics APIs**: Server endpoints for summary KPIs, revenue trends, category performance, regional distribution, top products, and recent transactions.
- **Executive Metric Cards**: Displays Total Revenue, Total Profit, Total Orders, Average Order Value, and Profit Margin.
- **Interactive Visualizations**: Powered by Recharts (Area charts, Bar charts, Donut charts).
- **Audit Table Stream**: Formatted table with status badges, category pills, and monetary indicators.
- **Loading & Error UX**: Skeleton loaders (`.skeleton-pulse`) and retry banner for network resilience.

### Phase 2: Advanced Analysis & Interactive Control
- **Global Multi-Dimensional Filtering**: Combined filtering across Date Ranges (presets & custom picker), Region, Category, Order Status, and Payment Method.
- **Dynamic Period Comparisons**: Computes period-over-period percentage deltas (Revenue, Profit, Orders, AOV vs prior period).
- **Time-Series Granularity**: Toggle between Daily, Weekly, and Monthly breakdown.
- **Deterministic Business Insights Engine**: Synthesizes top growth drivers, lowest category performance, and dominant territories automatically.
- **Interactive Chart Drill-Downs**: Clicking category or region chart elements applies instant dashboard-wide filters.
- **URL Parameter Synchronization**: Preserves filter state in URL query params across browser reloads.
- **Search, Sorting & Pagination**: Server-side regex search across Customer, Product, and Transaction ID, with sortable headers.

### Phase 3: Production Hardening, Reporting, CSV Export & Security
- **Filtered CSV Data Export**: Download RFC 4180 compliant CSV exports (`/api/analytics/export/csv`) respecting active filters and search queries.
- **Executive Summary Reporting**: Interactive report modal summarizing KPIs, filter scope, insights, category margins, and top SKUs.
- **Native PDF Print Support**: Clean browser print stylesheet (`@media print`) for generating PDF business reports.
- **Advanced Query Validation**: Strict input validator middleware (`queryValidator.js`) for date logic (`startDate <= endDate`), enums, and pagination parameters.
- **Security Baseline**: Hardened with Helmet HTTP security headers (CSP, HSTS, XSS protection, anti-sniff) and CORS controls.
- **API Rate Limiting**: Express rate limiter preventing brute-force or denial-of-service query overload (200 requests / 15 mins).
- **Database Optimization**: Mongoose compound indexing on `{ date: -1, category: 1, region: 1 }`, `{ date: -1, orderStatus: 1, paymentMethod: 1 }`, and `.lean()` execution.
- **Automated Testing**: Unit and integration test suites covering backend APIs (`node --test`) and frontend components (`vitest`).

---

## Tech Stack

- **Frontend**: React 18, Vite, Recharts, Lucide React, Axios, Vitest, Testing Library
- **Backend**: Node.js, Express.js (ES Modules, RESTful Architecture), Helmet, Express Rate Limit, Supertest
- **Database**: MongoDB with Mongoose (Aggregation pipelines & compound indexing)

---

## Architecture

```text
React Frontend (Vite)  ──►  Express REST API  ──►  Analytics Services  ──►  MongoDB Database
```

---

## Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB instance running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas.

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```

Seed the database with sample transactions:
```bash
npm run seed
```

Start the development server:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
```

Start the Vite development client:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Environment Variables

### `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bi_analytics_db
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api/analytics
```

---

## API Reference

All endpoints accept filter query parameters:
`?startDate=2026-01-01&endDate=2026-03-31&region=North%20America&category=Electronics&status=Completed`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/analytics/summary` | GET | Key KPIs and period-over-period comparison deltas |
| `/api/analytics/revenue-trend` | GET | Time-series data (`granularity=daily\|weekly\|monthly`) |
| `/api/analytics/category-performance` | GET | Sales, profit, and margin by product category |
| `/api/analytics/region-performance` | GET | Revenue contribution and AOV by geographic region |
| `/api/analytics/top-products` | GET | Ranked SKU performance (`sortBy=revenue\|profit&limit=5`) |
| `/api/analytics/insights` | GET | Deterministic business insights array |
| `/api/analytics/recent-transactions` | GET | Paginated, searchable, sortable audit stream |
| `/api/analytics/export/csv` | GET | Download filtered transactions as CSV file |

---

## Running Automated Tests

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

---

## Production Build

### Build Client Bundle
```bash
cd client
npm run build
```

### Run Production Backend
```bash
cd server
NODE_ENV=production npm start
```

---

## Verification & Definition of Done

- [x] Filtered CSV export generated from backend data (`GET /api/analytics/export/csv`)
- [x] Executive Report view with filter scope summary and native PDF print styling
- [x] Advanced input validation returning 400 Bad Request on invalid inputs (e.g. `startDate > endDate`)
- [x] Helmet HTTP security headers and CORS protection
- [x] Rate limiting active on `/api/analytics` routes
- [x] Mongoose compound indexes applied for query performance
- [x] Automated test suites passing in both `server` and `client`
- [x] `client` production build (`npm run build`) passing without errors
- [x] Secrets and `.env` files protected and excluded from Git tracking
- [x] Full Phase 1 and Phase 2 regression verified