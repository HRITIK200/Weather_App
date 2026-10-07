# 🌤️ AeroCast — Enterprise Full-Stack Weather Intelligence Platform

> **A modern, production-grade PERN stack (PostgreSQL, Express, React, Node.js) web application engineered with a clean layered architecture, dynamic glassmorphism UI, AI-powered weather summaries, and real-time atmospheric metrics.**

---

## 📌 Executive Summary & Architecture

AeroCast was engineered to simulate a modern product-based MNC engineering standard. Moving beyond basic static weather widgets, this platform integrates a secure backend proxy, database persistence, resilient offline fallbacks, and a sleek, responsive user interface.

```
┌──────────────────────────────────────────────────────────┐
│              Client Layer (React 18 + Vite)              │
│   Tailwind CSS • Lucide Icons • Plus Jakarta Sans Typography│
└────────────────────────────┬─────────────────────────────┘
                             │ Axios REST Requests (/api)
                             ▼
┌──────────────────────────────────────────────────────────┐
│              Proxy & Server (Node.js + Express)          │
│   Rate-Safe Routes • Request Logger • Global Error Handler│
└──────────────┬─────────────────────────────┬─────────────┘
               │                             │
    Parameterized Queries          Secure External API Fetch
               │                      (Hidden API Key)
               ▼                             ▼
┌──────────────────────────────┐ ┌─────────────────────────┐
│   Database (PostgreSQL)      │ │   OpenWeatherMap 2.5    │
│  search_history • favorites  │ │  Current Weather & 5-Day│
│ (Resilient Memory Fallback)  │ └─────────────────────────┘
└──────────────────────────────┘
```

---

## ✨ Features Breakdown

### 1. 🎨 Dynamic Glassmorphism Interface
- **Weather-Reactive Themes**: The page ambient gradients automatically shift according to the current weather condition (Clear/Sunny, Rain, Storm, Snow, Fog, Clouds, Night).
- **Glassmorphic Cards**: Multi-layer frosted glass cards with `backdrop-filter: blur(16px)` and subtle hover elevations.
- **Responsive Layout**: Designed mobile-first, ensuring high visual clarity across phones, tablets, and ultra-wide desktops.

### 2. 🧠 Smart Weather Intelligence (AI Insights)
- **Natural Language Summaries**: Human-like contextual weather reports (e.g. *"Overcast skies with mild temperatures across Paris. Consistent weather throughout the afternoon."*).
- **Smart Clothing Recommendations**: Contextual daily checklists recommending specific layers, footwear, and accessories (e.g., umbrella, sunscreen, winter coat).
- **Outdoor Activity Score**: A dynamic 1–10 rating scoring running, cycling, or outdoor fitness based on precipitation, wind speed, and heat index.

### 3. ⏱️ 24-Hour Hourly Forecast Carousel
- Smooth horizontally scrolling carousel displaying the next 24 hours of weather.
- Badges indicating time of day, weather icon, precipitation probability (`%`), and temperature.

### 4. 📅 5-Day Extended Forecast (Apple Weather Style)
- Daily breakdown of upcoming weather conditions and rain chances.
- **Normalized Temperature Range Bars**: High-to-low progress bars illustrating relative temperature fluctuations across the week.

### 5. 🔬 Comprehensive Meteorological Metrics Grid
- **Wind & Compass Direction**: Live wind speed (km/h) with a rotating compass dial indicating heading in degrees and cardinal direction.
- **Humidity & Comfort Index**: Humidity percentage paired with a dew-point comfort evaluation.
- **Visibility**: Clarity distance measured in kilometers.
- **Barometric Pressure**: Atmospheric pressure measured in hPa.
- **Sun Schedule**: Sunrise and Sunset times calculated in the destination's local time, accompanied by an animated daylight progress bar.
- **Cloud Coverage**: Cloud percentage evaluating sky overcast.

### 6. 📍 Geolocation & Intelligent Search
- **GPS Location Detection**: One-click geolocation using the browser's HTML5 Geolocation API.
- **Search Autocomplete**: Instant dropdown showing recent city searches.
- **Pinned Favorites Bar**: Quick-access pills for favorite cities, with instant pinning and unpinning.
- **Search History Slide-over Drawer**: Database-synced query logs with timestamps and individual deletion capabilities.

### 7. 🌡️ Real-Time Unit Switcher
- Instant toggle between Celsius (°C) and Fahrenheit (°F) with local storage persistence.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 (Vite SPA) | Fast rendering, modular component architecture |
| **Styling & Design** | Tailwind CSS | Utility-first CSS, custom glass tokens, responsive grid |
| **Icons** | Lucide React | Clean, lightweight SVG iconography |
| **Backend Runtime** | Node.js (ES Modules) | High-performance asynchronous runtime |
| **Web Server** | Express.js | REST routing, middleware pipelines |
| **Database** | PostgreSQL | Relational persistence for search histories and favorites |
| **Database Client** | `pg` (node-postgres) | Connection pooling with parameterized query safety |
| **HTTP Client** | Axios | External weather API querying & internal client calls |
| **Environment Config**| `dotenv` | Secure API key isolation |
| **Testing** | Postman | End-to-end API test suites and contracts |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed.
- (Optional) PostgreSQL installed and running locally. *If PostgreSQL is not running, the backend automatically switches to a resilient in-memory store so you can develop immediately.*

### 1. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```
> Server runs on `http://localhost:5000`. You can test health diagnostics at `http://localhost:5000/api/health`.

### 2. Frontend Setup
```bash
# Open a second terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
> Client runs on `http://localhost:3000` with automated proxying to the backend.

### 3. PostgreSQL Database Setup (Optional)
If you wish to connect a live PostgreSQL database:
1. Open pgAdmin, DBeaver, or psql.
2. Create database:
   ```sql
   CREATE DATABASE weather_db;
   ```
3. Run the schema script located at [`backend/src/config/schema.sql`](./backend/src/config/schema.sql).
4. Update `PGPASSWORD` inside [`backend/.env`](./backend/.env) with your local database password.

---

## 🧪 Postman API Verification

Import [`postman/Weather_App_Complete_API.postman_collection.json`](./postman/Weather_App_Complete_API.postman_collection.json) into Postman to run tests across:
1. `GET /api/health` — System status & database engine mode.
2. `GET /api/weather?city=London` — Weather lookup with automated history logging.
3. `GET /api/weather/coordinates?lat=51.5074&lon=-0.1278` — GPS coordinates lookup.
4. `GET /api/weather/forecast?city=London` — 24-hour hourly and 5-day forecasts.
5. `GET /api/history` — Query search history records.
6. `DELETE /api/history/:id` — Delete specific search log.
7. `GET /api/favorites` — Fetch pinned favorite cities.
8. `POST /api/favorites` — Pin a new city.
9. `DELETE /api/favorites/:id` — Unpin a favorite city.

---

## 💡 Technical Interview Talking Points

When presenting this project to recruiters, technical leads, or hiring managers:

1. **API Key Security & Backend Proxying**:
   - *Problem*: Storing API keys in frontend code exposes them to browser scrapers and quota theft.
   - *Solution*: Express acts as a secure intermediary proxy. External credentials remain strictly on the server in `.env`.
2. **Layered Backend Architecture**:
   - *Pattern*: Decoupled into Routes (routing), Controllers (orchestration), Services (external API integrations), Models (database queries), and Middlewares (logging & error handling).
   - *Benefit*: Enhances testability and allows swapping PostgreSQL or weather providers with zero controller impact.
3. **SQL Injection Defense**:
   - *Pattern*: All database queries in `historyModel.js` and `favoritesModel.js` utilize parameterized queries (`$1, $2`).
4. **Resilient Offline Architecture**:
   - If the PostgreSQL service is unavailable, the application gracefully captures errors and routes data to an in-memory storage array, ensuring zero downtime for end users.
5. **UI & State Performance**:
   - Vite proxy configuration avoids CORS issues during local development.
   - Dynamic CSS calculations normalize hourly and 5-day forecast visualizations without heavy charting libraries.
