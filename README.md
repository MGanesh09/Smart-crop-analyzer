# AgriSmart - Smart Crop & Agriculture Intelligence Platform

AgriSmart is a premium, responsive, and responsive agricultural platform built with React, Node.js, Express, MongoDB Atlas, and Tailwind CSS. It empowers farmers, agronomists, and administrators with intelligent telemetry monitoring, canopy diagnostics, crop scheduling calendars, and cost calculators.

## Core Features

* **JWT User Session Security**: Login, signup, and forgotten password recovery.
* **Farm Telemetry Mapping**: Mapped farm boundaries, soil texture categorization, and real-time NPK telemetry profiles.
* **AI Canopy Diagnostics (Powered by Google Gemini)**: leaf disease detection and expert chatbot consulting.
* **Financial Overhead Planner**: Cost sliders to forecast net margins in Indian Rupees (₹).
* **Community Help Forum**: Question listings, likes/comments drawers, and agronomist-verified resolutions.
* **Vector PDF Reports**: Instant client-side PDF document downloads using print-optimized layouts.
* **Admin Control Console**: Manage user roles, delete accounts, and view platform metrics.

---

## Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, Lucide icons, Axios, React Router.
* **Backend**: Node.js, Express.js, JWT, Mongoose, Multer, Cloudinary SDK.
* **Database**: MongoDB Atlas.
* **AI Module**: `@google/generative-ai` (Gemini SDK).

---

## Local Development Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Environment Variables Configuration

#### Backend Variables (`backend/.env`)
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_signature_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```

#### Frontend Variables (`frontend/.env`)
Create a `.env` file inside the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation & Run Scripts

In separate terminals, start the servers:

#### Run Backend Server:
```bash
cd backend
npm install
npm run dev
```

#### Run Frontend Client:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to access the platform.

---

## Production Deployment Guide

### Frontend Deployment (Vercel)
1. Set the build directory output override to `dist`.
2. Connect your repository, add the environment variable `VITE_API_URL` pointing to your hosted API.
3. Deploy! Vercel will automatically read `vercel.json` to handle SPA route fallback mapping.

### Backend Deployment (Render)
1. Create a **Web Service** on Render connected to your codebase repository.
2. Set the **Build Command** to `cd backend && npm install`.
3. Set the **Start Command** to `cd backend && npm start` (ensure `package.json` contains a `"start": "node src/server.js"` script).
4. Add all variables in the **Environment Variables** tab (especially `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`).
