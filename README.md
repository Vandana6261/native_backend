# Backend Native - 4-Layer Architecture Server

A Node.js + Express + MongoDB backend server built using ES Modules (`import/export`) adhering strictly to the **4-Layer Architecture** pattern.

---

## 🏗 Architecture Layers

```
Client (React Native App)
          │
          ▼
┌──────────────────┐
│  Routes Layer    │  src/routes/
│  (URL Routing)   │  Maps endpoints to specific controllers
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Controller Layer │  src/controllers/
│ (HTTP Handlers)  │  Parses requests, invokes services, returns responses
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Service Layer   │  src/services/
│ (Business Logic) │  Contains core application domain & business logic
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Repository Layer │  src/repositories/
│  (Data Access)   │  Encapsulates database queries (Mongoose abstraction)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Model Layer    │  src/models/
│ (Database Schema)│  Mongoose schema definitions & data structures
└──────────────────┘
```

---

## 📁 Directory Structure

```
Backend Native/
├── .env                  # Environment variables (PORT, MONGO_URI, NODE_ENV)
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Node dependencies & npm scripts
├── README.md             # Project documentation
└── src/
    ├── app.js            # Express app configuration & middleware setup
    ├── server.js         # Entry point: DB connection & server initialization
    ├── config/
    │   └── db.js         # Mongoose connection & error listeners
    ├── controllers/
    │   └── health.controller.js
    ├── services/
    │   └── health.service.js
    ├── repositories/
    │   └── health.repository.js
    ├── models/
    │   └── health.model.js
    ├── routes/
    │   ├── index.js      # Main API router aggregator (/api/v1)
    │   └── health.routes.js
    └── middlewares/
        ├── error.middleware.js     # Global error handler
        └── notFound.middleware.js  # 404 Route handler
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Update your `.env` file with your MongoDB URI:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/backend_native?retryWrites=true&w=majority
```

### 3. Run Server

#### Development Mode (with hot reloading via nodemon):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

---

## 📱 Connecting with React Native

When connecting your React Native mobile app to this backend in local development:
- **Android Emulator**: Use `http://10.0.2.2:5000/api/v1`
- **iOS Simulator**: Use `http://localhost:5000/api/v1`
- **Physical Device**: Use your computer's local IP address, e.g. `http://192.168.x.x:5000/api/v1`
