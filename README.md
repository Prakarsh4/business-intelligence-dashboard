# Executive Data Analytics & Business Intelligence Dashboard

A full-stack, production-grade business intelligence dashboard delivering real-time metrics, financial trends, product breakdowns, and regional performance insights.

---

## Development Roadmap
- **Phase 1 (Completed & Current):** Foundation, MongoDB Data Layer, Analytics Aggregation APIs & Core Responsive Dashboard.
- **Phase 2 (Upcoming):** Advanced multi-dimensional filtering, deep comparative analytics, anomaly detection & enhanced charting.
- **Phase 3 (Upcoming):** Production hardening, CSV/PDF automated reporting, role-based controls, containerization & deployment readiness.

---

## Tech Stack
- **Frontend:** React 18, Vite, Recharts, Lucide React, Axios, Responsive CSS
- **Backend:** Node.js, Express.js (ES Modules, RESTful architecture)
- **Database:** MongoDB with Mongoose (Aggregation pipelines & compound indexing)

---

## Project Structure
```text
├── client/          # React + Vite frontend application
│   ├── src/
│   │   ├── api/          # Centralized API service layer
│   │   ├── components/   # Metrics, Charts, Tables & Skeletons
│   │   ├── pages/        # Dashboard view
│   │   └── utils/        # Number & date formatting utilities
├── server/          # Express REST API backend
│   ├── config/      # MongoDB connection
│   ├── controllers/ # HTTP handlers
│   ├── middleware/  # Centralized error handling & CORS
│   ├── models/      # Mongoose schemas & indexes
│   ├── routes/      # Express API routes
│   ├── seed/        # 350-record realistic business data generator
│   └── services/    # MongoDB aggregation analytics engine