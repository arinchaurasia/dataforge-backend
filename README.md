# 🛡️ DataForge Pro - Advanced CSV Analytics & Integrity Platform

DataForge Pro is a high-performance, full-stack data management platform designed for seamless CSV processing, real-time analytics, and data integrity auditing. Built with a focus on visual excellence and real-time synchronization, it empowers users to transform raw datasets into actionable insights with professional-grade precision.

![DataForge Dashboard](https://via.placeholder.com/1200x600/0f172a/38bdf8?text=DataForge+Pro+Dashboard+Preview)

## 🚀 Key Features

- **⚡ Real-Time Synchronization**: Powered by Socket.io, the dashboard updates instantly across all connected clients whenever data is uploaded or modified.
- **🛡️ Data Integrity Audit**: Advanced validation engine that identifies "Improper Data" (missing fields, invalid formats, logical errors) and provides a detailed health score.
- **📊 Dynamic Visualizations**: Interactive charts providing breakdown by demographics, salary metrics, and organizational roles.
- **🔍 Advanced Filtering Engine**: Global search and field-specific filtering (including strict gender matching) to navigate massive datasets effortlessly.
- **📥 Professional Export**: One-click CSV export of processed and cleaned data.
- **🔑 Secure Authentication**: Industry-standard JWT-based authentication with protected API endpoints.

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Real-Time**: Socket.io
- **File Processing**: Multer & CSV-Parser

### Frontend
- **Library**: React.js
- **Styling**: Tailwind CSS (Glassmorphism & Dark Mode)
- **Charts**: Chart.js / React-Chartjs-2
- **State Management**: React Hooks (useCallback, useEffect)
- **Networking**: Axios

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas or Local Instance

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/dataforge-pro.git
cd dataforge-pro
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Start the application:
```bash
npm start
```

## 📐 Project Structure

```text
dataforge-pro/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── services/        # CSV processing logic
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── App.js       # Main application logic
│   │   └── index.css    # Global styles & design system
└── uploads/             # Temporary storage for processing
```

## 🛡️ Data Validation Logic
The platform automatically audits every row uploaded. Current validation includes:
- **Name**: Must be present.
- **Email**: Must follow standard RFC formats.
- **Age**: Must be a positive integer.
- **Salary**: Sanitized and converted to numeric values.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
**DataForge Pro** — *Forging clarity from raw data.*
